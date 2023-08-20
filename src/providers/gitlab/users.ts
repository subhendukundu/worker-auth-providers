import { BaseProvider, OAuthTokens } from '../../types';
import { ConfigError, ProviderGetUserError, TokenError } from '../../utils/errors';
import { parseQuerystring } from '../../utils/helpers';
import { logger } from '../../utils/logger';
import { Gitlab } from "./types"

export async function getTokensFromCode(
  code: string,
  { clientId, clientSecret, redirectUrl }: BaseProvider.TokensFromCodeOptions
): Promise<OAuthTokens> {
  const params = {
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUrl,
  };

  const response = await fetch(
    'https://gitlab.com/oauth/token',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params).toString(),
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

export async function getUser(token: string): Promise<Gitlab.UserResponse> {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const getUserResponse = await fetch('https://gitlab.com/api/v4/user', {
      method: 'GET',
      headers,
    });
    const data: Gitlab.UserResponse = await getUserResponse.json();
    logger.log(`[provider user data], ${JSON.stringify(data)}`, 'info');
    return data;
  } catch (e: any) {
    logger.log(`[error], ${JSON.stringify(e.stack)}`, 'error');
    throw new ProviderGetUserError({
      message: 'There was an error fetching the user',
    });
  }
}

export default async function callback({ options, request }: BaseProvider.CallbackOptions): Promise<Gitlab.CallbackResponse> {
  const { query }: any = parseQuerystring(request);
  logger.setEnabled(options?.isLogEnabled || false);
  logger.log(`[code], ${JSON.stringify(query.code)}`, 'info');
  if (!query.code) {
    throw new ConfigError({
      message: 'No code is passed!',
    });
  }
  const tokens = await getTokensFromCode(query.code, options);
  const accessToken = tokens.access_token;
  logger.log(`[access_token], ${JSON.stringify(accessToken)}`, 'info');
  const providerUser = await getUser(accessToken);
  return {
    user: providerUser,
    tokens,
  };
}
