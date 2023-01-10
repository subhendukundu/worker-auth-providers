import { ConfigError, ProviderGetUserError, TokenError } from '../../utils/errors';
import { parseQuerystring } from '../../utils/helpers';
import { logger } from '../../utils/logger';
async function getTokensFromCode(code, { redirectUrl, clientId, clientSecret }) {
    logger.log(`[redirectUrl], ${redirectUrl}`, 'info');
    const params = {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUrl,
        code,
        grant_type: 'authorization_code',
    };
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            accept: 'application/json',
        },
        body: JSON.stringify(params),
    });
    const result = await response.json();
    logger.log(`[tokens], ${JSON.stringify(result)}`, 'info');
    if (result.error) {
        throw new TokenError({
            message: result.error_description,
        });
    }
    return result;
}
async function getUser(token) {
    try {
        const getUserResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        const data = await getUserResponse.json();
        logger.log(`[provider user data], ${JSON.stringify(data)}`, 'info');
        return data;
    }
    catch (e) {
        logger.log(`[error], ${JSON.stringify(e.stack)}`, 'error');
        throw new ProviderGetUserError({
            message: 'There was an error fetching the user',
        });
    }
}
export default async function callback({ options, request }) {
    const { query } = parseQuerystring(request);
    logger.setEnabled(options?.isLogEnabled || false);
    logger.log(`[query], ${JSON.stringify(query)}`, 'info');
    if (!query.code) {
        throw new ConfigError({
            message: 'No code is passed!',
        });
    }
    const tokens = await getTokensFromCode(query.code, options);
    const accessToken = tokens.access_token;
    const providerUser = await getUser(accessToken);
    return {
        user: providerUser,
        tokens
    };
}
