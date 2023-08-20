import { BaseProvider, OAuthTokens } from "../../types";
import { Discord } from "./types";
export declare function getTokensFromCode(code: string, { clientId, clientSecret, redirectUrl, scope, }: BaseProvider.TokensFromCodeOptions): Promise<OAuthTokens>;
export declare function getUser(token: string): Promise<Discord.UserResponse>;
export default function callback({ options, request, }: BaseProvider.CallbackOptions): Promise<Discord.CallbackResponse>;
