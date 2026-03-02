import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  confirmFileUpload,
  createFolder,
  deleteFile,
  deleteFolder,
  downloadFromPresignedUrl,
  editFile,
  editFolder,
  listFolderContentsById,
  requestFileDownloadUrl,
  requestFileUpload,
  uploadToPresignedUrl,
} from "../api/services/drive";
import { getErrorMessage } from "../utils/errors";

const EMPTY_CONTENT = { folder_id: null, path: [], folders: [], files: [] };

export default function useDriveManager(folderId) {
  const navigate = useNavigate();
  const [content, setContent] = useState(EMPTY_CONTENT);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const entries = useMemo(() => {
    const folders = content.folders.map((folder) => ({ type: "folder", data: folder }));
    const files = content.files.map((file) => ({ type: "file", data: file }));
    return [...folders, ...files];
  }, [content.files, content.folders]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setContent(await listFolderContentsById(folderId));
    } catch (err) {
      setError(getErrorMessage(err, "Nu am putut încărca datele."));
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const goToFolder = useCallback(
    (targetId) => {
      if (targetId === null || targetId === undefined) {
        navigate("/");
        return;
      }
      navigate(`/folder/${targetId}`);
    },
    [navigate],
  );

  const runAction = useCallback(
    async (action, successMessage) => {
      setBusy(true);
      setError("");
      setSuccess("");

      try {
        await action();
        if (successMessage) {
          setSuccess(successMessage);
        }
        await loadData();
      } catch (err) {
        setError(getErrorMessage(err, "Operația a eșuat."));
      } finally {
        setBusy(false);
      }
    },
    [loadData],
  );

  const createFolderPrompt = useCallback(async () => {
    const name = window.prompt("Nume folder nou")?.trim();
    if (!name) {
      return;
    }

    await runAction(() => createFolder({ name, parent_folder_id: folderId }), "Folder creat.");
  }, [folderId, runAction]);

  const uploadFile = useCallback(
    async (file) => {
      if (!file.type) {
        setError("Fișierul nu are MIME type detectat. Alege un fișier suportat.");
        return;
      }

      await runAction(async () => {
        const uploadMeta = await requestFileUpload({
          name: file.name,
          size: file.size,
          mime_type: file.type,
          folder_id: folderId,
        });

        try {
          await uploadToPresignedUrl(uploadMeta.presigned_url, file, file.type);
          await confirmFileUpload(uploadMeta.file_id, { success: true });
        } catch (err) {
          await confirmFileUpload(uploadMeta.file_id, { success: false });
          throw err;
        }
      }, "Fișier uploadat.");
    },
    [folderId, runAction],
  );

  const downloadFile = useCallback(
    async (file) => {
      await runAction(async () => {
        const payload = await requestFileDownloadUrl(file.id);
        await downloadFromPresignedUrl(payload.url, file.name);
      });
    },
    [runAction],
  );

  const renameFolder = useCallback(
    async (folder) => {
      const newName = window.prompt("Nume nou folder", folder.name)?.trim();
      if (!newName || newName === folder.name) {
        return;
      }

      await runAction(() => editFolder(folder.id, { new_name: newName }), "Folder redenumit.");
    },
    [runAction],
  );

  const deleteFolderEntry = useCallback(
    async (folder) => {
      if (!window.confirm(`Ștergi folderul "${folder.name}" și conținutul lui?`)) {
        return;
      }

      await runAction(() => deleteFolder(folder.id), "Folder șters.");
    },
    [runAction],
  );

  const renameFile = useCallback(
    async (file) => {
      const newName = window.prompt("Nume nou fișier", file.name)?.trim();
      if (!newName || newName === file.name) {
        return;
      }

      await runAction(() => editFile(file.id, { new_name: newName }), "Fișier redenumit.");
    },
    [runAction],
  );

  const deleteFileEntry = useCallback(
    async (file) => {
      if (!window.confirm(`Ștergi fișierul "${file.name}"?`)) {
        return;
      }

      await runAction(() => deleteFile(file.id), "Fișier șters.");
    },
    [runAction],
  );

  return {
    content,
    entries,
    loading,
    busy,
    error,
    success,
    setError,
    setSuccess,
    loadData,
    goToFolder,
    createFolderPrompt,
    uploadFile,
    downloadFile,
    renameFolder,
    deleteFolderEntry,
    renameFile,
    deleteFileEntry,
  };
}
