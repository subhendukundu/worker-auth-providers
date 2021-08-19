import type { ApiEndpoint } from 'vitedge'
import { spotify } from "worker-auth-providers";

export default <ApiEndpoint>{
  async handler({ params }) {
    const location =  await spotify.redirect({
        options: {
          clientId: process.env.VITEDGE_SPOTIFY_CLIENT_ID,
          redirectUrl: process.env.VITEDGE_SPOTIFY_REDIRECT_PROD_URL
        }
    });
    return {
        status: 302,
        headers: {
            location: location,
        },
    };
  },
}