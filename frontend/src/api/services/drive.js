import { request } from "../client";

// FILES
export function requestFileUpload({ name, size, mime_type, folder_id = null }) {
	return request("/drive/files", {
		method: "POST",
		json: { name, size, mime_type, folder_id },
	});
}

export function confirmFileUpload(fileId, { success }) {
	return request(`/drive/files/${fileId}/upload-confirm`, {
		method: "PATCH",
		json: { success },
	});
}

export function requestFileDownloadUrl(fileId) {
	return request(`/drive/files/${fileId}/download-url`);
}

export function deleteFile(fileId) {
	return request(`/drive/files/${fileId}`, { method: "DELETE" });
}

export function editFile(fileId, { new_name, new_folder_id } = {}) {
	const payload = {};
	if (new_name !== undefined) payload.new_name = new_name;
	if (new_folder_id !== undefined) payload.new_folder_id = new_folder_id;

	return request(`/drive/files/${fileId}`, {
		method: "PATCH",
		json: payload,
	});
}

// FOLDERS
export function createFolder({ name, parent_folder_id = null }) {
	return request("/drive/folders", {
		method: "POST",
		json: { name, parent_folder_id },
	});
}

export function deleteFolder(folderId) {
	return request(`/drive/folders/${folderId}`, { method: "DELETE" });
}

export function editFolder(folderId, { new_name, new_parent_folder_id } = {}) {
	const payload = {};
	if (new_name !== undefined) payload.new_name = new_name;
	if (new_parent_folder_id !== undefined) payload.new_parent_folder_id = new_parent_folder_id;

	return request(`/drive/folders/${folderId}`, {
		method: "PATCH",
		json: payload,
	});
}

export function listRootFolderContents() {
	return request("/drive/folders/contents");
}

export function listFolderContents(folderId) {
	return request(`/drive/folders/contents/${folderId}`);
}

// HELPERS
export async function uploadToPresignedUrl(url, file, contentType) {
	const headers = {};
	if (contentType) headers["Content-Type"] = contentType;

	const response = await fetch(url, {
		method: "PUT",
		headers,
		body: file,
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Upload failed: ${response.status} ${text}`.trim());
	}
}
