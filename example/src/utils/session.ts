function getCookie(name) {
    if (typeof window !== "undefined") {
        const value = `; ${document.cookie}`;
        const parts: any = value.split(`; ${name}=`);
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

export async function createUserDetails(arg: any) {
    const data = {
        ...arg,
        id: await (await fetch('https://uuid.rocks/plain')).text()
    }
    return data;
}
export function getJwt(request) {
    let requestHeaders = JSON.stringify(Object.fromEntries(request.headers), null, 2)
    console.log(`Request headers: ${requestHeaders}`)
    const authHeader = request.headers.get('Authorization');
    console.log("[authHeader]", authHeader)
    if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
        return null
    }
    return authHeader.substring(6).trim()
}