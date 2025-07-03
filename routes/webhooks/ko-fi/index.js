import { verifyToken } from '../../../util/verifyToken.js'

const STATUS_OK = 200
const STATUS_PREVENT_RETRY = STATUS_OK

export default async function (fastify, opts) {
  fastify.post('/', async (request, reply) => {
    try {
      const { data } = request.body
      if (!data) {
        fastify.log.warn('Missing data field in webhook payload')
        return reply.code(400).send({ message: 'Missing data' })
      }

      let parsed
      try {
        parsed = JSON.parse(data)
      } catch (err) {
        fastify.log.error('Failed to parse JSON data:', err)
        return reply.code(400).send({ message: 'Invalid JSON in data field' })
      }

      const token = parsed.verification_token || ''
      const expected = process.env.KO_FI_VERIFICATION_TOKEN || ''
      if (!verifyToken(token, expected)) {
        fastify.log.error(`Token verification failed: "${token}"`)
        return reply.code(STATUS_PREVENT_RETRY).send({ message: 'Invalid token' })
      }

      fastify.log.info({ payload: parsed }, 'Ko-fi Webhook Received')

      return reply.code(STATUS_OK).send({ message: 'Received' })
    } catch (err) {
      fastify.log.error('Unexpected error in Ko-fi webhook handler:', err)
      return reply.code(STATUS_PREVENT_RETRY).send({
        message: 'Error processing webhook'
      })
    }
  })
}