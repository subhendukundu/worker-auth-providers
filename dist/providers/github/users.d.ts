import { BaseProvider, OAuthTokens } from '../../types';
import { Github } from "./types";
export declare function getTokensFromCode(code: string, { clientId, clientSecret }: BaseProvider.TokensFromCodeOptions): Promise<OAuthTokens>;
export declare function getUser(token: string, userAgent?: string): Promise<Github.UserResponse>;
export default function callback({ options, request }: BaseProvider.CallbackOptions): Promise<Github.CallbackResponse>;
