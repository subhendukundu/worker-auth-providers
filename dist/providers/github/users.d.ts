export declare type CallbackOptions = {
    options: {
        clientId: string;
        clientSecret: string;
        userAgent?: string;
        isLogEnabled?: boolean;
    };
    request: Request;
};
export declare type User = {
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
export declare type Tokens = {
    access_token: string;
    token_type: string;
};
export declare type CallbackResult = {
    user: User;
    tokens: Tokens;
};
export default function callback({ options, request }: CallbackOptions): Promise<CallbackResult>;
