import { request } from "../client";

function buildPayload(entries) {
	const payload = {};
	for (const [key, value] of Object.entries(entries)) {
		if (value !== undefined) {
			payload[key] = value;
		}
	}
	return payload;
}

async function throwOnFailedResponse(response, prefix) {
	if (response.ok) {
		return;
	}

	const text = await response.text();
	throw new Error(`${prefix}: ${response.status} ${text}`.trim());
}

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
	return request(`/drive/files/${fileId}`, {
		method: "PATCH",
		json: buildPayload({ new_name, new_folder_id }),
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
	return request(`/drive/folders/${folderId}`, {
		method: "PATCH",
		json: buildPayload({ new_name, new_parent_folder_id }),
	});
}

export function listRootFolderContents() {
	return request("/drive/folders/contents");
}

export function listFolderContents(folderId) {
	return request(`/drive/folders/contents/${folderId}`);
}

export function listFolderContentsById(folderId = null) {
	if (folderId === null || folderId === undefined) {
		return listRootFolderContents();
	}
	return listFolderContents(folderId);
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

	await throwOnFailedResponse(response, "Upload failed");
}

export async function downloadFromPresignedUrl(url, fileName) {
	const response = await fetch(url, { method: "GET" });
	await throwOnFailedResponse(response, "Download failed");

	const blob = await response.blob();
	const blobUrl = URL.createObjectURL(blob);

	try {
		const link = document.createElement("a");
		link.href = blobUrl;
		link.download = fileName || "download";
		document.body.appendChild(link);
		link.click();
		link.remove();
	} finally {
		URL.revokeObjectURL(blobUrl);
	}
}
