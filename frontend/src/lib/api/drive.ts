import { api } from '$lib/api/client';
import type 
{
    FileStatus, 
    FileResponse,
    FileUploadRequest,
    FileUploadResponse,
    FileDownloadResponse,
    UploadStatusRequest,
    FolderCreateRequest,
    FolderCreateResponse,
    FolderResponse,
    FolderContentResponse
    } from '$lib/api/contracts';
import { handleApiError } from '$lib/utils/errorHandling';

// Files

export async function uploadFileRequest(payload: FileUploadRequest): Promise<FileUploadResponse> {
    const { data, error } = await api.POST('/drive/files', {
        body: payload
    });
    if (error) handleApiError(error, "File upload request failed")
    return data as FileUploadResponse;
}

export async function confirmFileUpload(fileId: number, status: FileStatus): Promise<FileResponse | null> {
	const payload: UploadStatusRequest = {
		success: status === 'UPLOADED'
	};

	const { data, error } = await api.PATCH('/drive/files/{file_id}/upload-confirm', {
		params: {
			path: {
				file_id: fileId
			}
		},
		body: payload
	});

	if (error) handleApiError(error, "Failed to confirm file upload")

	return data as FileResponse | null;
}

export async function requestDownloadUrl(fileId: number): Promise<FileDownloadResponse> {
    const { data, error } = await api.GET('/drive/files/{file_id}/download-url', {
        params: {
            path: {
                file_id: fileId
            }
        }
    });
    if (error) handleApiError(error, "Failed to request download URL")
    
    return data as FileDownloadResponse;
}

export async function deleteFile(fileId: number): Promise<string> {
	const { data, error } = await api.DELETE('/drive/files/{file_id}', {
		params: {
			path: {
				file_id: fileId
			}
		}
	});

	if (error) handleApiError(error, "File deletion failed")

	return (data as { message: string }).message;
}

export async function renameFile(fileId: number, newName: string): Promise<FileResponse> {
	const { data, error } = await api.PATCH('/drive/files/{file_id}', {
		params: { path: { file_id: fileId } },
		body: { new_name: newName }
	});
    
    if (error) handleApiError(error, "File renaming failed")
	return data as FileResponse;
}

export async function moveFile(fileId: number, newFolderId: number | null): Promise<FileResponse> {
	const { data, error } = await api.PATCH('/drive/files/{file_id}', {
		params: { path: { file_id: fileId } },
		body: { new_folder_id: newFolderId }
	});

    if (error) handleApiError(error, "File moving failed")

	return data as FileResponse;
}

// Folders

export async function listContentRoot(): Promise<FolderContentResponse> {
    const { data, error } = await api.GET('/drive/folders/contents');
    if (error) handleApiError(error, "Failed to list root folder contents")
    return data as FolderContentResponse;
}

export async function listContentFolder(folderId: number): Promise<FolderContentResponse> {
    const { data, error } = await api.GET('/drive/folders/contents/{folder_id}', {
        params: {
            path: {
                folder_id: folderId
            }
        }
    });
    if (error) handleApiError(error, "Failed to list folder contents")
    return data as FolderContentResponse;
}

export async function createFolder(payload: FolderCreateRequest): Promise<FolderCreateResponse> {
    const { data, error } = await api.POST('/drive/folders', {
        body: payload
    });

    if (error) handleApiError(error, "Folder creation failed")

    return data as FolderCreateResponse;
}

export async function renameFolder(folderId: number, newName: string): Promise<FolderResponse> {
	const { data, error } = await api.PATCH('/drive/folders/{folder_id}', {
		params: { path: { folder_id: folderId } },
		body: { new_name: newName }
	});

    if (error) handleApiError(error, "Folder renaming failed")


	return data as FolderResponse;
}

export async function moveFolder(folderId: number, newParentFolderId: number | null): Promise<FolderResponse> {
	const { data, error } = await api.PATCH('/drive/folders/{folder_id}', {
		params: { path: { folder_id: folderId } },
		body: { new_parent_folder_id: newParentFolderId }
	});

    if (error) handleApiError(error, "Folder moving failed")


	return data as FolderResponse;
}

export async function deleteFolder(folderId: number): Promise<string> {
    const { data, error } = await api.DELETE('/drive/folders/{folder_id}', {
        params: {
            path: {
                folder_id: folderId
            }
        }
    });

    if (error) handleApiError(error, "Folder deletion failed")
    return (data as { message: string }).message;
}
