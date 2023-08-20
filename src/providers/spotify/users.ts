import * as queryString from "query-string";
import {
  ConfigError,
  ProviderGetUserError,
  TokenError,
} from "../../utils/errors";
import { parseQuerystring } from "../../utils/helpers";
import { logger } from "../../utils/logger";
import { Spotify } from "./types";
import { BaseProvider, OAuthTokens } from "../../types";

export async function getTokensFromCode(
  code: string,
  { clientId, clientSecret, redirectUrl }: BaseProvider.TokensFromCodeOptions
): Promise<OAuthTokens> {
  logger.log(`[redirectUrl], ${JSON.stringify(redirectUrl)}`, "info");

  const params = queryString.stringify({
    redirect_uri: redirectUrl,
    code,
    grant_type: "authorization_code",
  });
  const token = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(
    `https://accounts.spotify.com/api/token?${params}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${token}`,
      },
    }
  );
  const result: any = await response.json();
  logger.log(`[tokens], ${JSON.stringify(result)}`, "info");

  if (result.error) {
    throw new TokenError({
      message: result.error_description,
    });
  }
  return result as OAuthTokens;
}

export async function getUser(token: string): Promise<Spotify.UserResponse> {
  try {
    const getUserResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data: Spotify.UserResponse = await getUserResponse.json();
    logger.log(`[provider user data], ${JSON.stringify(data)}`, "info");
    return data;
  } catch (e) {
    logger.log(`[query], ${JSON.stringify(e)}`, "error");
    throw new ProviderGetUserError({
      message: "There was an error fetching the user",
    });
  }
}

export default async function callback({
  options,
  request,
}: BaseProvider.CallbackOptions): Promise<Spotify.CallbackResponse> {
  const { query }: any = parseQuerystring(request);
  logger.setEnabled(options?.isLogEnabled || false);
  logger.log(`[query], ${JSON.stringify(query)}`, "info");
  if (!query.code) {
    throw new ConfigError({
      message: "No code is paased!",
    });
  }
  const tokens = await getTokensFromCode(query.code, options);
  const accessToken = tokens.access_token;
  const providerUser = await getUser(accessToken);
  return {
    user: providerUser,
    tokens,
  };
}
