import { BaseProvider, OAuthTokens } from "../../types";
import { Facebook } from "./types";
export declare function getTokensFromCode(code: string, { clientId, clientSecret, redirectUrl }: BaseProvider.TokensFromCodeOptions): Promise<OAuthTokens>;
export declare function getUser(token: string, fields?: string): Promise<Facebook.UserResponse>;
export default function callback({ options, request, }: Facebook.CallbackOptions): Promise<Facebook.CallbackResponse>;
