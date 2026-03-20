import { invalidateAll } from '$app/navigation';
import { createFolder, renameFile, renameFolder, deleteFile, deleteFolder, requestDownloadUrl, uploadFileRequest, confirmFileUpload } from '$lib/api/drive';

interface UploadItem {
    id: string;
    file: File;
    progress: number;
    status: 'waiting' | 'uploading' | 'error' | 'confirming';
    speed: string;
    eta: string;
}

class DriveService {
    uploadQueue = $state<UploadItem[]>([]);
    isUploading = $state(false);

    currentUpload = $derived(this.uploadQueue.find(u => u.status === 'uploading' || u.status === 'confirming') || null);

    async registerUploadFiles(files: FileList | File[], parentFolderId: number | null) {
        const fileList = Array.from(files);
        
        const newItems: UploadItem[] = fileList.map(file => ({
            id: crypto.randomUUID(),
            file,
            progress: 0,
            status: 'waiting',
            speed: '0 MB/s',
            eta: ''
        }));

        this.uploadQueue.push(...newItems);

        if (!this.isUploading) {
            this.processUploadQueue(parentFolderId);
        }
    }

    private async processUploadQueue(parentFolderId: number | null) {
        const nextItem = this.uploadQueue.find(u => u.status === 'waiting');
        if (!nextItem) {
            this.isUploading = false;
            return;
        }

        this.isUploading = true;
        
        try {
            const ticket = await uploadFileRequest({
                name: nextItem.file.name,
                size: nextItem.file.size,
                folder_id: parentFolderId ? Number(parentFolderId) : null,
                mime_type: nextItem.file.type || 'application/octet-stream'
            });

            if (!ticket?.presigned_url) throw new Error("Missing upload URL");

            nextItem.status = 'uploading';
            await this.uploadFileToStorage(nextItem, ticket.presigned_url);

            nextItem.status = 'confirming';
            await confirmFileUpload(ticket.file_id, 'UPLOADED');

            this.uploadQueue = this.uploadQueue.filter(u => u.id !== nextItem.id);
            await invalidateAll();
            // toast: Upload completed successfully 
        } catch (err) {
            // toast
            console.error("Upload error:", err);

            this.uploadQueue = this.uploadQueue.filter(u => u.id !== nextItem.id);
        }

        this.processUploadQueue(parentFolderId);
    }

    private uploadFileToStorage(item: UploadItem, url: string) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            let startTime = Date.now();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    item.progress = Math.round((e.loaded / e.total) * 100);
                    
                    const elapsed = (Date.now() - startTime) / 1000;
                    if (elapsed > 0) {
                        const bytesPerSec = e.loaded / elapsed;
                        item.speed = (bytesPerSec / (1024 * 1024)).toFixed(1) + ' MB/s';
                        const remaining = (e.total - e.loaded) / bytesPerSec;
                        item.eta = remaining > 60 
                            ? Math.ceil(remaining / 60) + 'm left' 
                            : Math.ceil(remaining) + 's left';
                    }
                }
            });

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
                    else reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            };

            xhr.onerror = () => reject(new Error("Network error during upload"));
            
            xhr.open('PUT', url);
            xhr.setRequestHeader('Content-Type', item.file.type || 'application/octet-stream');
            xhr.send(item.file);
        });
    }


    async downloadFile(fileId: number, fileName: string) {
        try {
            const data = await requestDownloadUrl(fileId);
            
            if (!data.url) throw new Error("URL de download invalid");

            const link = document.createElement('a');
            link.href = data.url;
            link.setAttribute('download', fileName);
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            
            
            return true;
        } catch (err: any) {
            // toast : Error downloading file
            return false;
        }
    }

    async createFolder(folderName: string, parentFolderId: number | null) {
        try {
            let parentId = parentFolderId ? parseInt(parentFolderId.toString()) : null;
            if (parentId === 0) parentId = null;

            await createFolder({ 
                name: folderName, 
                parent_folder_id: parentId 
            });


            await invalidateAll();
            // toast : Folder created successfully
            return true;
        } catch (err) {
            // toast : Error creating folder
            return false;
        }
    }

    // for both files and folders
    async renameItem(newName: string, renameTargetId: number | null, renameItemType: 'file' | 'folder', fileExtensionTargetFile?: string | null) {
        try {
            if (!renameTargetId) return;

            if (renameItemType === 'file') {
                if (fileExtensionTargetFile && !newName.endsWith(`.${fileExtensionTargetFile}`)) {
                    newName += `.${fileExtensionTargetFile}`;
                }

                await renameFile(renameTargetId, newName);
            } else {
                await renameFolder(renameTargetId, newName);
            }

            await invalidateAll();
            // toast : Item renamed successfully
            return true;
        } catch (err) {
            // toast : Error renaming item
            return false;
        }
    }

    async deleteItem(id: number, type: 'file' | 'folder') {
        try {
            if (type === 'file') {
                await deleteFile(id);
            } else {
                await deleteFolder(id);
            }

            await invalidateAll();
            // toast : Item deleted successfully
            return true;
        } catch (err) {
            // toast : Error deleting item
            return false;
        }
    }
}

export const driveService = new DriveService();