import { default as users, getUser, getTokensFromCode } from "./users";
import redirect from "./redirect";
export * from "./types";
export const provider = {
    users,
    getUser,
    getTokensFromCode,
    redirect,
};
