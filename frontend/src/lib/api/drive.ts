import { api } from '$lib/api/client';
import type 
{
    FileStatus, 
    FileResponse,
    FileUploadRequest,
    FileUploadResponse,
    FileEditRequest,
    FileDownloadResponse,
    UploadStatusRequest,
    FolderCreateRequest,
    FolderCreateResponse,
    FolderEditRequest,
    FolderResponse,
    FolderContentResponse
    } from '$lib/api/contracts';

// Files

export async function uploadFileRequest(payload: FileUploadRequest): Promise<FileUploadResponse> {
    const { data } = await api.POST('/drive/files', {
        body: payload
    });
    return data as FileUploadResponse;
}

export async function confirmFileUpload(fileId: number, status: FileStatus): Promise<FileResponse | null> {
	const payload: UploadStatusRequest = {
		success: status === 'UPLOADED'
	};

	const { data } = await api.PATCH('/drive/files/{file_id}/upload-confirm', {
		params: {
			path: {
				file_id: fileId
			}
		},
		body: payload
	});

	return data as FileResponse | null;
}

export async function requestDownloadUrl(fileId: number): Promise<FileDownloadResponse> {
    const { data } = await api.GET('/drive/files/{file_id}/download-url', {
        params: {
            path: {
                file_id: fileId
            }
        }
    });
    return data as FileDownloadResponse;
}

export async function deleteFile(fileId: number): Promise<string> {
	const { data } = await api.DELETE('/drive/files/{file_id}', {
		params: {
			path: {
				file_id: fileId
			}
		}
	});

	return (data as { message: string }).message;
}

export async function renameFile(fileId: number, newName: string): Promise<FileResponse> {
	const { data } = await api.PATCH('/drive/files/{file_id}', {
		params: { path: { file_id: fileId } },
		body: { new_name: newName }
	});

	return data as FileResponse;
}

export async function moveFile(fileId: number, newFolderId: number | null): Promise<FileResponse> {
	const { data } = await api.PATCH('/drive/files/{file_id}', {
		params: { path: { file_id: fileId } },
		body: { new_folder_id: newFolderId }
	});

	return data as FileResponse;
}

// Folders

export async function listContentRoot(): Promise<FolderContentResponse> {
    const { data } = await api.GET('/drive/folders/contents');
    return data as FolderContentResponse;
}

export async function listContentFolder(folderId: number): Promise<FolderContentResponse> {
    const { data } = await api.GET('/drive/folders/contents/{folder_id}', {
        params: {
            path: {
                folder_id: folderId
            }
        }
    });
    return data as FolderContentResponse;
}

export async function createFolder(payload: FolderCreateRequest): Promise<FolderCreateResponse> {
    const { data } = await api.POST('/drive/folders', {
        body: payload
    });
    return data as FolderCreateResponse;
}

export async function renameFolder(folderId: number, newName: string): Promise<FolderResponse> {
	const { data } = await api.PATCH('/drive/folders/{folder_id}', {
		params: { path: { folder_id: folderId } },
		body: { new_name: newName }
	});

	return data as FolderResponse;
}

export async function moveFolder(folderId: number, newParentFolderId: number | null): Promise<FolderResponse> {
	const { data } = await api.PATCH('/drive/folders/{folder_id}', {
		params: { path: { folder_id: folderId } },
		body: { new_parent_folder_id: newParentFolderId }
	});

	return data as FolderResponse;
}

export async function deleteFolder(folderId: number): Promise<string> {
    const { data } = await api.DELETE('/drive/folders/{folder_id}', {
        params: {
            path: {
                folder_id: folderId
            }
        }
    });
    return (data as { message: string }).message;
}

