import { invalidateAll } from '$app/navigation';
import { createFolder, renameFile, renameFolder, deleteFile, deleteFolder, requestDownloadUrl } from '$lib/api/drive';

class DriveService {

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