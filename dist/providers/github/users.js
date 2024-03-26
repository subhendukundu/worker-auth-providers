import { ConfigError, ProviderGetUserError, TokenError } from '../../utils/errors';
import { parseQuerystring } from '../../utils/helpers';
import { logger } from '../../utils/logger';
export async function getTokensFromCode(code, { clientId, clientSecret }) {
    const params = {
        client_id: clientId,
        client_secret: clientSecret,
        code,
    };
    const response = await fetch('https://github.com/login/oauth/access_token', {
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
export async function getUser(token, userAgent = 'worker-auth-providers-github-oauth-login') {
    try {
        const headers = {
            accept: 'application/vnd.github.v3+json',
            authorization: `token ${token}`,
            'user-agent': userAgent,
        };
        logger.log(`[user getUser headers], ${JSON.stringify(headers)}`, 'info');
        const getUserResponse = await fetch('https://api.github.com/user', {
            method: 'GET',
            headers,
        });
        const data = await getUserResponse.json();
        logger.log(`[provider user data], ${JSON.stringify(data)}`, 'info');
        if (!data.email) {
            // If the user does not have a public email, get another via the GitHub API
            // See https://docs.github.com/en/rest/users/emails#list-public-email-addresses-for-the-authenticated-user
            const res = await fetch("https://api.github.com/user/emails", {
                method: 'GET',
                headers,
            });
            const emails = await res.json();
            data.emails = emails;
            if (Array.isArray(emails)) {
                data.email = (emails.find((e) => e.primary) ?? emails[0]).email;
            }
        }
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
    logger.log(`[code], ${JSON.stringify(query.code)}`, 'info');
    if (!query.code) {
        throw new ConfigError({
            message: 'No code is paased!',
        });
    }
    const tokens = await getTokensFromCode(query.code, options);
    const accessToken = tokens.access_token;
    logger.log(`[access_token], ${JSON.stringify(accessToken)}`, 'info');
    const providerUser = await getUser(accessToken, options?.userAgent);
    return {
        user: providerUser,
        tokens
    };
}
