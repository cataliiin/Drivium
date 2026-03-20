import { listContentRoot, listContentFolder } from '$lib/api/drive';

export const load = ({ params }) => {
    const id = params.folderId;
    
    const contentPromise = id 
        ? listContentFolder(parseInt(id)) 
        : listContentRoot();

    return {
        streamed: {
            driveContent: contentPromise
        }
    };
};