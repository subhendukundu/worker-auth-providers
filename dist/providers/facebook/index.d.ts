import { SocialProvider } from "../../types";
import { Facebook } from "./types";
export * from "./types";
export interface FecebookProvider extends SocialProvider {
    redirect({ options }: Facebook.RedirectOptions): Promise<string>;
    convertPrivateKeyToClientSecret?(options: any): Promise<string>;
    users({ options, request, }: Facebook.CallbackOptions): Promise<Facebook.CallbackResponse>;
}
declare const _default: FecebookProvider;
export default _default;
