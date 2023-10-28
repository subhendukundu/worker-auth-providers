import { BaseProvider, OAuthTokens } from "../../types";
import {
  ConfigError,
  ProviderGetUserError,
  TokenError,
} from "../../utils/errors";
import { parseQuerystring } from "../../utils/helpers";
import { logger } from "../../utils/logger";
import { Facebook } from "./types";

export async function getTokensFromCode(
  code: string,
  { clientId, clientSecret, redirectUrl }: BaseProvider.TokensFromCodeOptions
): Promise<OAuthTokens> {
  logger.log(`[redirectUrl], ${JSON.stringify(redirectUrl)}`, "info");

  const params = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    code,
  };

  const response = await fetch(
    "https://graph.facebook.com/v4.0/oauth/access_token",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(params),
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

export async function getUser(
  token: string,
  fields = "id,email,first_name,last_name"
): Promise<Facebook.UserResponse> {
  try {
    const getUserResponse = await fetch(
      `https://graph.facebook.com/me?fields=${fields}&access_token=${token}`
    );
    const data: Facebook.UserResponse = await getUserResponse.json();
    logger.log(`[provider user data], ${JSON.stringify(data)}`, "info");
    return data;
  } catch (e) {
    logger.log(`[error], ${JSON.stringify(e)}`, "error");
    throw new ProviderGetUserError({
      message: "There was an error fetching the user",
    });
  }
}

export default async function callback({
  options,
  request,
}: Facebook.CallbackOptions): Promise<Facebook.CallbackResponse> {
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
  const providerUser = await getUser(accessToken, options.fields);
  return {
    user: providerUser,
    tokens,
  };
}
