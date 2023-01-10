import {
	ConfigError,
	ProviderGetUserError,
	TokenError
} from '../../utils/errors';
import { parseQuerystring } from '../../utils/helpers';
import { logger } from '../../utils/logger';

type CallbackOptions = {
	options: Options;
	request: Request;
};

type Options = {
	clientId: string;
	clientSecret: string;
	redirectUrl: string;
	scope?: string;
	isLogEnabled?: boolean;
};

type Request = {
	url: string;
};

type CallbackResult = {
	user: User;
	tokens: Tokens;
};

type User = {
	[key: string]: any;
};

type Tokens = {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
};
type GetTokensFromCodeOptions = {
	clientId: string;
	clientSecret: string;
	redirectUrl: string;
	scope?: string;
};

function _encode(obj: any) {
	let string = "";

	for (const [key, value] of Object.entries(obj)) {
		if (!value) continue;
		string += `&${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`;
	}

	return string.substring(1);
}



async function getTokensFromCode(
	code: string,
	{ clientId, clientSecret, redirectUrl, scope = 'identify' }: GetTokensFromCodeOptions
): Promise<Tokens> {
	logger.log(`[redirectUrl]', ${JSON.stringify(redirectUrl)}`, 'info');

	const data = {
		'client_id': clientId,
		'client_secret': clientSecret,
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': redirectUrl,
		'scope': scope
	};
	const params = _encode(data);
	const response = await fetch(`https://discordapp.com/api/oauth2/token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params
	});

	const result: any = await response.json();
	logger.log(`[result]', ${JSON.stringify(result)}`, 'info');

	if (result.error) {
		throw new TokenError({
			message: result.error_description
		});
	}
	return result;
}

async function getUser(oauthData: Tokens): Promise<User> {
	try {
		const getUserResponse = await fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${oauthData.token_type} ${oauthData.access_token}`,
			}
		});
		const data: User = await getUserResponse.json();
		logger.log(`[provider user data]', ${JSON.stringify(data)}`, 'info');
		return data;
	} catch (e: any) {
		logger.log(`[get user error]', ${e.message}`, 'error');
		throw new ProviderGetUserError({
			message: 'There was an error fetching the user'
		});
	}
}

export default async function callback({ options, request }: CallbackOptions): Promise<CallbackResult> {
	const { query }: any = parseQuerystring(request);
	logger.setEnabled(options?.isLogEnabled || false);
	logger.log(`[query]', ${JSON.stringify(query)}`, 'info');
	if (!query.code) {
		throw new ConfigError({
			message: 'No code is paased!'
		});
	}
	const tokens = await getTokensFromCode(query.code, options);
	const providerUser = await getUser(tokens);
	return {
		user: providerUser,
		tokens
	};
}
