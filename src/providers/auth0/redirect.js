import * as queryString from 'query-string';
import { ConfigError } from '../../utils/errors';

async function generateStateParam({ kvProvider }) {
	const resp = await fetch("https://csprng.xyz/v1/api")
	const { Data: state } = await resp.json()
	await kvProvider.put(`state-${state}`, true, { expirationTtl: 86400 })
	return state
}

export default async function redirect({ options }) {
	const {
		domain,
		clientId,
		redirectUrl,
		scope = 'openid email profile',
		responseType = 'code',
		state = 'pass-through value',
		audience = 'organise',
		kvProvider,
	} = options;

	if (!clientId || !domain) {
		throw new ConfigError({
			message: 'No client id or domain passed'
		});
	}

	const params = queryString.stringify({
		client_id: clientId,
		redirect_uri: redirectUrl,
		response_type: responseType,
		scope,
		audience,
		...(state ? { state } : {}),
	});

	const generatedState = await generateStateParam({ kvProvider })
	const url = state ? `https://${domain}/authorize?${params}` : `https://${domain}/authorize?${params}&state=${encodeURIComponent(generatedState)}`;
	return url;
}
