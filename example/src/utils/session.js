function getCookie(name) {
    if (typeof window !== "undefined") {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    }
    return "";
}
export function deleteCookie() {
    document.cookie =
        "__Session-worker.auth.providers-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export function getSessionToken() {
    const token = getCookie("__Session-worker.auth.providers-token");
    return token;
}
