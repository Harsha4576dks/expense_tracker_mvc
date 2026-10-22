export const getErrorMessage = (error) => {
    const detail = error?.response?.data?.detail ?? error;

    if (typeof detail === "string") {
        return detail;
    }

    if (Array.isArray(detail)) {
        return detail.map((item) => item.msg ?? String(item)).join(",");
    }

    if (detail && typeof detail === "object") {
        return JSON.stringify(detail);
    }

    return "An error occurred.";
};