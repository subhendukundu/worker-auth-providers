import * as queryString from 'query-string';
import { ConfigError } from '../../utils/errors';

type Options = {
	clientId: string;
	redirectUrl: string;
	scope?: string;
	responseType?: string;
	prompt?: string;
	permissions?: string;
	guildId?: string;
	disableGuildSelect?: boolean;
	state?: any;
};

type Props = {
	options: Options
}

export default async function redirect({ options }: Props): Promise<string> {
	const {
		clientId,
		redirectUrl,
		scope = 'identify',
		responseType = 'code',
		prompt,
		permissions,
		guildId,
		disableGuildSelect,
		state
	} = options;
	if (!clientId) {
		throw new ConfigError({
			message: 'No client id passed'
		});
	}
	const params = queryString.stringify({
		client_id: clientId,
		prompt,
		redirect_uri: redirectUrl,
		response_type: responseType,
		scope,
		permissions,
		guild_id: guildId,
		disable_guild_select: disableGuildSelect,
		state
	});

	const url = `https://discord.com/api/oauth2/authorize?${params}`;
	return url;
}
