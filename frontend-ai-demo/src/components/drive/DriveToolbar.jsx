export default function DriveToolbar({
  uploadInputId,
  loading,
  busy,
  onCreateFolder,
  onUploadChange,
  onRefresh,
}) {
  const disabled = loading || busy;

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div>
        <h1 className="h5 mb-1">Drive</h1>
      </div>

      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={onCreateFolder}
          disabled={disabled}
        >
          Folder nou
        </button>

        <label htmlFor={uploadInputId} className="btn btn-primary btn-sm mb-0">
          Upload
        </label>
        <input
          id={uploadInputId}
          type="file"
          className="d-none"
          onChange={onUploadChange}
          disabled={disabled}
        />

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onRefresh}
          disabled={disabled}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
