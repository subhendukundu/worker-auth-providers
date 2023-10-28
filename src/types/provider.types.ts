export interface KVProviderOptions {
  expirationTtl: number;
}

export interface KVProvider {
  get: (key: string) => Promise<string>;
  put: (key: string, data: string, options: KVProviderOptions) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

export namespace BaseProvider {
  export interface JWTOptions {
    secret: string;
    phone: string;
    claims: Record<string, string | number>;
  }

  export interface VerifyOptions {
    options: {
      kvProvider: KVProvider;
      phone: string;
      otp: string;
      secret: string;
      claims: Record<string, string>;
    };
  }
  export interface SendOptions {
    options: {
      region: string;
      otpLength?: number;
      message?: string;
      phone: string;
      kvProvider: KVProvider;
      expirationTtl?: number;
      accountSid: string;
      authToken: string;
      from?: string;
    };
  }

  export interface TokensFromCodeOptions {
    clientId: string;
    clientSecret: string;
    redirectUrl?: string;
    isLogEnabled?: boolean;
    userAgent?: string;
	scope?: string;
  }

  export interface ApiError {
    error: string;
    error_description: string;
  }

  export interface CallbackOptions {
    options: TokensFromCodeOptions;
    request: Request;
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
      showDialog?: boolean;
      allowSignup?: boolean;
      state?: string;
      responseMode?: "query" | "fragment" | "form_post";
    };
  }
}

export interface OAuthTokens {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

type RedirectFunction<T> = (options: BaseProvider.RedirectOptions) => Promise<T>;
type UsersFunction<T> = (options: BaseProvider.CallbackOptions) => Promise<T>;

export interface SocialProvider<T = any> {
  getUser(token: string, userAgent?: string): Promise<any>;
  getTokensFromCode(
    code: string,
    options: BaseProvider.TokensFromCodeOptions
  ): Promise<OAuthTokens>;
  convertPrivateKeyToClientSecret?(options: any): Promise<string>;
  redirect: RedirectFunction<T>;
  users: UsersFunction<T>;
}
