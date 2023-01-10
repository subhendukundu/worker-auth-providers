import { ConfigError, ProviderGetUserError, TokenError } from '../../utils/errors';
import { parseQuerystring } from '../../utils/helpers';
import { logger } from '../../utils/logger';

type TokensResponse = {
  access_token: string;
  scope: string;
  token_type: string;
}
export type CallbackOptions = {
  options: {
    clientId: string;
    clientSecret: string;
    userAgent?: string;
    isLogEnabled?: boolean;
  },
  request: Request
};

export type User = {
  id: number;
  login: string;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string | null;
  hireable: boolean;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  emails: {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string;
  }[] | null;
};

export type Tokens = {
  access_token: string;
  token_type: string;
};

export type CallbackResult = {
  user: User;
  tokens: Tokens;
};

async function getTokensFromCode(
  code: string,
  { clientId, clientSecret }: { clientId: string, clientSecret: string }
): Promise<TokensResponse> {
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
  return result as TokensResponse;
}

async function getUser(token: string, userAgent: string = 'worker-auth-providers-github-oauth-login'): Promise<User> {
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
    const data: User = await getUserResponse.json();
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

export default async function callback({ options, request }: CallbackOptions): Promise<CallbackResult> {
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
