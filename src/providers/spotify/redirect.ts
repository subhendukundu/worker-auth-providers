import * as queryString from 'query-string';
import { ConfigError } from '../../utils/errors';

type SpotifyOAuthOptions = {
	clientId: string;
	redirectUrl: string;
	scope?: string;
	responseType?: string;
	showDialog?: boolean;
};

export default async function redirect({ options }: { options: SpotifyOAuthOptions }): Promise<string> {
	const {
		clientId,
		redirectUrl,
		scope = 'user-library-read playlist-modify-private',
		responseType = 'code',
		showDialog = false
	} = options;
	if (!clientId) {
		throw new ConfigError({
			message: 'No client id passed'
		});
	}
	const params = queryString.stringify({
		client_id: clientId,
		redirect_uri: redirectUrl,
		response_type: responseType,
		scope,
		show_dialog: showDialog
	});

	const url = `https://accounts.spotify.com/authorize?${params}`;
	return url;
}
