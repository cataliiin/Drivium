function FolderRow({ folder, busy, onOpen, onRename, onDelete }) {
  return (
    <li className="list-group-item d-flex align-items-center justify-content-between gap-2">
      <button
        type="button"
        className="btn btn-link p-0 text-decoration-none text-start"
        onClick={() => onOpen(folder.id)}
      >
        <span className="me-2" aria-hidden>
          📁
        </span>
        {folder.name}
      </button>

      <div className="btn-group btn-group-sm">
        <button type="button" className="btn btn-outline-secondary" onClick={() => onRename(folder)} disabled={busy}>
          Rename
        </button>
        <button type="button" className="btn btn-outline-danger" onClick={() => onDelete(folder)} disabled={busy}>
          Delete
        </button>
      </div>
    </li>
  );
}

function FileRow({ file, busy, onDownload, onRename, onDelete }) {
  return (
    <li className="list-group-item d-flex align-items-center justify-content-between gap-2">
      <div>
        <span className="me-2" aria-hidden>
          📄
        </span>
        {file.name}
      </div>

      <div className="btn-group btn-group-sm">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => onDownload(file)}
          disabled={busy || file.status !== "UPLOADED"}
        >
          Download
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={() => onRename(file)} disabled={busy}>
          Rename
        </button>
        <button type="button" className="btn btn-outline-danger" onClick={() => onDelete(file)} disabled={busy}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default function DriveEntriesList({
  loading,
  entries,
  busy,
  onOpenFolder,
  onRenameFolder,
  onDeleteFolder,
  onDownloadFile,
  onRenameFile,
  onDeleteFile,
}) {
  return (
    <div className="card drivium-card drive-list-scroll">
      <div className="card-body p-0 overflow-auto">
        {loading ? (
          <p className="text-muted mb-0 p-3">Se încarcă...</p>
        ) : entries.length === 0 ? (
          <p className="text-muted mb-0 p-3">Folderul este gol.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {entries.map((entry) =>
              entry.type === "folder" ? (
                <FolderRow
                  key={`folder-${entry.data.id}`}
                  folder={entry.data}
                  busy={busy}
                  onOpen={onOpenFolder}
                  onRename={onRenameFolder}
                  onDelete={onDeleteFolder}
                />
              ) : (
                <FileRow
                  key={`file-${entry.data.id}`}
                  file={entry.data}
                  busy={busy}
                  onDownload={onDownloadFile}
                  onRename={onRenameFile}
                  onDelete={onDeleteFile}
                />
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
