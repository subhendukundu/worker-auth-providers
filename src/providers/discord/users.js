import {
	ConfigError,
	ProviderGetUserError,
	TokenError
} from '../../utils/errors';
import { parseQuerystring } from '../../utils/helpers';

async function getTokensFromCode(
	code,
	{ clientId, clientSecret, redirectUrl }
) {
	console.log('[redirectUrl]', redirectUrl);
	const creds = btoa(`${clientId}:${clientSecret}`);
	const response = await fetch(
		`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}`,
		{
			method: 'POST',
			headers: {
				Authorization: `Basic ${creds}`
			}
		}
	);
	const result = await response.json();
	console.log('[tokens]', result);

	if (result.error) {
		throw new TokenError({
			message: result.error_description
		});
	}
	return result;
}

async function getUser(oauthData) {
	try {
		const getUserResponse = await fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${oauthData.token_type} ${oauthData.access_token}`,
			}
		});
		const data = await getUserResponse.json();
		console.log('[provider user data]', data);
		return data;
	} catch (e) {
		console.log('[get user error]', e);
		throw new ProviderGetUserError({
			message: 'There was an error fetching the user'
		});
	}
}

export default async function callback({ options, request }) {
	const { query } = parseQuerystring(request);
	console.log('[query]', query);
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
