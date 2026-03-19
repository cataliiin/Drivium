import { listContentRoot, listContentFolder } from '$lib/api/drive';

export const load = async ({ params }) => {
    const id = params.folderId;
    try {
        const driveContent = id 
            ? await listContentFolder(parseInt(id)) 
            : await listContentRoot();
        return { driveContent };
    } catch (err) {
        return { 
            driveContent: null, 
            error: err instanceof Error ? err.message : 'Failed to load' 
        };
    }
};