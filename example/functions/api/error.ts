import { BadRequestError } from 'vitedge/errors'
import type { ApiEndpoint } from 'vitedge'

export default <ApiEndpoint>{
  async handler() {
    // Errors can be thrown to return a JSON payload.
    // Test it at `http://localhost:<port>/api/error`
    throw new BadRequestError('Yikes', {
      inputs: ['email'],
    })
  },
}
