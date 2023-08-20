import { BaseProvider, OAuthTokens } from "../../types";

export namespace Facebook {
  export interface UserResponse {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  }

  export interface CallbackOptions {
    request: Request;
    options: {
      fields?: string;
    } & BaseProvider.TokensFromCodeOptions;
  }

  export interface CallbackResponse {
    user: UserResponse;
    tokens: OAuthTokens;
  }

  export interface RedirectOptions {
    options: {
      clientId: string;
      /**
       * @deprecated Use `redirectTo` instead.
       */
      redirectUrl?: string;

      /**
       * Use this option instead of `redirectUrl`, which is deprecated.
       */
      redirectTo?: string;
      scope?: string[];
      responseType?: string;
      authType?: string;
      display?: string;
    };
  }
}
