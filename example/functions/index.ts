/* Worker entry */
// This file is only used in production and
// preview mode, not during development.

import { handleEvent } from 'vitedge/worker'

addEventListener('fetch', (event) => {
  try {
    event.respondWith(
      handleEvent(event, {
        http2ServerPush: {
          destinations: ['style'],
        },
        willRequestApi({ url, query }) {
          console.log('API:', url.pathname, query)
        },
      })
    )
  } catch (error) {
    event.respondWith(
      new Response(error.message || error.toString(), {
        status: 500,
      })
    )
  }
})
