import {
	ConfigError,
	ProviderGetUserError,
	TokenError
} from '../../utils/errors';
import { parseQuerystring } from '../../utils/helpers';

function _encode(obj) {
	let string = "";
  
	for (const [key, value] of Object.entries(obj)) {
	  if (!value) continue;
	  string += `&${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`;
	}
  
	return string.substring(1);
}
  
async function getTokensFromCode(
	code,
	{ clientId, clientSecret, redirectUrl, scope = 'identify' }
) {
	console.log('[redirectUrl]', redirectUrl);
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
	const { query }: any = parseQuerystring(request);
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
