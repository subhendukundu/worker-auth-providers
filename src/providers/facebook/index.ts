import { default as users, getUser, getTokensFromCode } from "./users";
import redirect from "./redirect";
import { SocialProvider } from "../../types";
import { Facebook } from "./types";
export * from "./types";

export interface FecebookProvider extends SocialProvider {
  redirect({ options }: Facebook.RedirectOptions): Promise<string>;
  convertPrivateKeyToClientSecret?(options: any): Promise<string>;
  users({
    options,
    request,
  }: Facebook.CallbackOptions): Promise<Facebook.CallbackResponse>;
}

export default {
  users,
  getUser,
  getTokensFromCode,
  redirect,
} as FecebookProvider;
