import { ConfigError, ProviderGetUserError, TokenError } from '../../utils/errors';
import { parseQuerystring } from '../../utils/helpers';

async function getTokensFromCode(code, { clientId, clientSecret, redirectUrl }) {
  console.log('[redirectUrl]', redirectUrl);

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
  console.log('[tokens]', result);

  if (result.error) {
    throw new TokenError({
      message: result.error_description,
    });
  }
  return result;
}

async function getUser(token) {
  try {
    const getUserResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await getUserResponse.json();
    console.log('[provider user data]', data);
    return data;
  } catch (e) {
    console.log('[get user error]', e);
    throw new ProviderGetUserError({
      message: 'There was an error fetching the user',
    });
  }
}

export default async function callback({ options, request }) {
    const { query } = parseQuerystring(request);
    console.log('[query]', query);
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
