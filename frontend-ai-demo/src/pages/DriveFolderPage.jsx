import { useMemo } from "react";
import { useParams } from "react-router-dom";
import StatusAlert from "../components/StatusAlert";
import BreadcrumbNav from "../components/drive/BreadcrumbNav";
import DriveToolbar from "../components/drive/DriveToolbar";
import DriveEntriesList from "../components/drive/DriveEntriesList";
import useDriveManager from "../hooks/useDriveManager";

export default function DriveFolderPage() {
  const { folder_id: routeFolderId } = useParams();
  const uploadInputId = "drive-upload-input";

  const folderId = useMemo(() => {
    if (!routeFolderId) {
      return null;
    }
    const parsed = Number(routeFolderId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [routeFolderId]);

  const {
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
  } = useDriveManager(folderId);

  async function handleUploadChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await uploadFile(file);
    event.target.value = "";
  }

  return (
    <div className="d-grid gap-3">
      <DriveToolbar
        uploadInputId={uploadInputId}
        loading={loading}
        busy={busy}
        onCreateFolder={createFolderPrompt}
        onUploadChange={handleUploadChange}
        onRefresh={loadData}
      />

      <div className="card drivium-card">
        <div className="card-body py-2">
          <BreadcrumbNav path={content.path} onNavigate={goToFolder} />
        </div>
      </div>

      <StatusAlert message={error} variant="danger" onClose={() => setError("")} />
      <StatusAlert message={success} variant="success" onClose={() => setSuccess("")} />

      <DriveEntriesList
        loading={loading}
        entries={entries}
        busy={busy}
        onOpenFolder={goToFolder}
        onRenameFolder={renameFolder}
        onDeleteFolder={deleteFolderEntry}
        onDownloadFile={downloadFile}
        onRenameFile={renameFile}
        onDeleteFile={deleteFileEntry}
      />
    </div>
  );
}