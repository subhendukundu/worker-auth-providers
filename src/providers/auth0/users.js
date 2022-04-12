import jwt from "jsonwebtoken"
import { ConfigError, TokenError } from '../../utils/errors';

async function getTokensFromCode(code, { clientId, clientSecret, redirectUrl, domain }) {
  console.log('[redirectUrl]', redirectUrl);

  const params = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    code,
    grant_type: 'authorization_code',
  };

  const response = await fetch(`${domain}/oauth/token`, {
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

export default async function callback({ options, request, kvProvider }) {
  const url = new URL(request.url)

  const state = url.searchParams.get('state')
  if (!state) {
    throw new ConfigError({
      message: 'No state is paased!',
    });
  }

  const storedState = await kvProvider.get(`state-${state}`)
  if (!storedState) {
    throw new ConfigError({
      message: 'Not a valid state is stored!',
    });
  }

  const code = url.searchParams.get('code')

  if (!code) {
    throw new ConfigError({
      message: 'No code is paased!',
    });
  }

  const tokens = await getTokensFromCode(code, options);
  const { id_token: idToken } = tokens;
  const user = jwt.decode(idToken)

  return {
    user,
    tokens
  };
}
