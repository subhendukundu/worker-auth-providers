import * as queryString from "query-string";
import { ConfigError } from "../../utils/errors";
export default async function redirect({ options, }) {
    const { clientId, redirectUrl, // Deprecated, use redirectTo instead
    redirectTo, // Use this instead of redirectUrl
    scope = "user-library-read playlist-modify-private", responseType = "code", showDialog = false, } = options;
    if (!clientId) {
        throw new ConfigError({
            message: "No client id passed",
        });
    }
    if (redirectUrl && !redirectTo) {
        // If redirectUrl is provided but redirectTo is not, use redirectUrl (backward compatibility)
        console.warn("The 'redirectUrl' option is deprecated. Please use 'redirectTo' instead.");
    }
    const usedRedirect = redirectTo || redirectUrl; // Use redirectTo if provided, else fallback to redirectUrl
    const params = queryString.stringify({
        client_id: clientId,
        redirect_uri: usedRedirect,
        response_type: responseType,
        scope,
        show_dialog: showDialog,
    });
    const url = `https://accounts.spotify.com/authorize?${params}`;
    return url;
}
