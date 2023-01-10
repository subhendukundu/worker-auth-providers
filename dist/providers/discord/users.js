import { ConfigError, ProviderGetUserError, TokenError } from '../../utils/errors';
import { parseQuerystring } from '../../utils/helpers';
import { logger } from '../../utils/logger';
function _encode(obj) {
    let string = "";
    for (const [key, value] of Object.entries(obj)) {
        if (!value)
            continue;
        string += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
    return string.substring(1);
}
async function getTokensFromCode(code, { clientId, clientSecret, redirectUrl, scope = 'identify' }) {
    logger.log(`[redirectUrl]', ${JSON.stringify(redirectUrl)}`, 'info');
    const data = {
        'client_id': clientId,
        'client_secret': clientSecret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirectUrl,
        'scope': scope
    };
    const params = _encode(data);
    const response = await fetch(`https://discordapp.com/api/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });
    const result = await response.json();
    logger.log(`[result]', ${JSON.stringify(result)}`, 'info');
    if (result.error) {
        throw new TokenError({
            message: result.error_description
        });
    }
    return result;
}
async function getUser(oauthData) {
    try {
        const getUserResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${oauthData.token_type} ${oauthData.access_token}`,
            }
        });
        const data = await getUserResponse.json();
        logger.log(`[provider user data]', ${JSON.stringify(data)}`, 'info');
        return data;
    }
    catch (e) {
        logger.log(`[get user error]', ${e.message}`, 'error');
        throw new ProviderGetUserError({
            message: 'There was an error fetching the user'
        });
    }
}
export default async function callback({ options, request }) {
    const { query } = parseQuerystring(request);
    logger.setEnabled(options?.isLogEnabled || false);
    logger.log(`[query]', ${JSON.stringify(query)}`, 'info');
    if (!query.code) {
        throw new ConfigError({
            message: 'No code is paased!'
        });
    }
    const tokens = await getTokensFromCode(query.code, options);
    const providerUser = await getUser(tokens);
    return {
        user: providerUser,
        tokens
    };
}
