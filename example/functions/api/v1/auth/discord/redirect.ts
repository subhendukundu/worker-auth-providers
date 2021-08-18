import type { ApiEndpoint } from 'vitedge'
import { discord } from "worker-auth-providers";

export default <ApiEndpoint>{
  async handler({ params }) {
    const location =  await discord.redirect({
        options: {
          clientId: process.env.VITEDGE_DISCORD_CLIENT_ID,
          redirectUrl: process.env.VITEDGE_DISCORD_REDIRECT_PROD_URL,
          scope: 'identify email',
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