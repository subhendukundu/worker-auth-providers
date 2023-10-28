import * as queryString from "query-string";
import { ConfigError } from "../../utils/errors";
export default async function redirect({ options, }) {
    const { clientId, redirectUrl, redirectTo, scope = "identify", responseType = "code", prompt, permissions, guildId, disableGuildSelect, state, } = options;
    if (!clientId) {
        throw new ConfigError({
            message: "No client id passed",
        });
    }
    if (redirectUrl && !redirectTo) {
        // If redirectUrl is provided but redirectTo is not, use redirectUrl (backward compatibility)
        console.warn("The 'redirectUrl' option is deprecated. Please use 'redirectTo' instead.");
    }
    // TODO: @subh to remove this in next version
    const usedRedirect = redirectTo || redirectUrl; // Use redirectTo if provided, else fallback to redirectUrl
    const params = queryString.stringify({
        client_id: clientId,
        prompt,
        redirect_uri: usedRedirect,
        response_type: responseType,
        scope,
        permissions,
        guild_id: guildId,
        disable_guild_select: disableGuildSelect,
        state,
    });
    const url = `https://discord.com/api/oauth2/authorize?${params}`;
    return url;
}
