import * as queryString from 'query-string';
import { ConfigError } from '../../utils/errors';

export default async function redirect({ options }) {
  const { clientId, redirectUrl } = options;
  const params = queryString.stringify({
    client_id: clientId,
    redirect_uri: redirectUrl,
    response_type: 'code',
    scope: 'openid email profile',
    include_granted_scopes: 'true',
    state: 'pass-through value',
  });

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  return googleLoginUrl;
}
