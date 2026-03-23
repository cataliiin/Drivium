
function handleApiError(error: any, fallbackMessage: string): never {
    const msg = Array.isArray(error.detail)
        ? `${error.detail[0].loc.at(-1)}: ${error.detail[0].msg}`
        : (error.detail || fallbackMessage);
    throw new Error(msg);
}

export { handleApiError };