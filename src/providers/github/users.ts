import { BaseProvider, OAuthTokens } from '../../types';
import { ConfigError, ProviderGetUserError, TokenError } from '../../utils/errors';
import { parseQuerystring } from '../../utils/helpers';
import { logger } from '../../utils/logger';
import { Github } from "./types"

export async function getTokensFromCode(
  code: string,
  { clientId, clientSecret }: BaseProvider.TokensFromCodeOptions
): Promise<OAuthTokens> {
  const params = {
    client_id: clientId,
    client_secret: clientSecret,
    code,
  };

  const response = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(params),
    },
  );
  const result: any = await response.json();
  logger.log(`[tokens], ${JSON.stringify(result)}`, 'info');

  if (result.error) {
    throw new TokenError({
      message: result.error_description,
    });
  }
  return result as OAuthTokens;
}

export async function getUser(token: string, userAgent: string = 'worker-auth-providers-github-oauth-login'): Promise<Github.UserResponse> {
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
    const data: Github.UserResponse = await getUserResponse.json();
    logger.log(`[provider user data], ${JSON.stringify(data)}`, 'info');
    if (!data.email) {
      // If the user does not have a public email, get another via the GitHub API
      // See https://docs.github.com/en/rest/users/emails#list-public-email-addresses-for-the-authenticated-user
      const res: any = await fetch("https://api.github.com/user/emails", {
        method: 'GET',
        headers,
      });
      const emails = await res.json()
      data.emails = emails
      data.email = (emails.find((e: any) => e.primary) ?? emails[0]).email
    }
    return data;
  } catch (e: any) {
    logger.log(`[error], ${JSON.stringify(e.stack)}`, 'error');
    throw new ProviderGetUserError({
      message: 'There was an error fetching the user',
    });
  }
}

export default async function callback({ options, request }: BaseProvider.CallbackOptions): Promise<Github.CallbackResponse> {
  const { query }: any = parseQuerystring(request);
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
