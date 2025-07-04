import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { KoFiWebhookPayload, koFiWebhookPayloadSchema } from '../../../types.js'
import { Type } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { verifyToken } from '../../../util/verifyToken.js'

const WEBHOOK_OK = 200
const WEBHOOK_NO_RETRY = WEBHOOK_OK

const koFiWebhookBodySchema = Type.Object({
  data: Type.String()
})
const validateKoFiWebhookBody = TypeCompiler.Compile(koFiWebhookBodySchema)

export default async function (fastify: FastifyInstance) {
  fastify.post('/', {
    preValidation: (request, reply, done) => {
      const body = request.body as unknown
      if (!validateKoFiWebhookBody.Check(body)) {
        throw fastify.httpErrors.badRequest(
          `Failed to validate webhook body: ${JSON.stringify([
            ...validateKoFiWebhookBody.Errors(body)
          ])}`)
      }
      try {
        request.body.data = JSON.parse(body.data)
      } catch (err) {
        throw fastify.httpErrors.badRequest(`Failed to parse webhook JSON data: ${err}`)
      }
      done();
    },
    schema: {
      body: Type.Object({
        data: koFiWebhookPayloadSchema
      })
    },
    handler: async (
      request: FastifyRequest<{ Body: { data: KoFiWebhookPayload } }>,
      reply: FastifyReply
    ) => {
      const data = request.body.data
      const verificationToken = data.verification_token
      const expectedToken = process.env.KO_FI_VERIFICATION_TOKEN || ''
      if (!verifyToken(verificationToken, expectedToken)) {
        fastify.log.error(`Received an invalid verification token: "${verificationToken}"`)
        return reply.code(WEBHOOK_NO_RETRY).send()
      }
      if (fastify.db.webhookPayloads.findOne({ message_id: data.message_id })) {
        fastify.log.warn(`Ignored message with ID ${data.message_id} because it already exists`)
        return reply.code(WEBHOOK_NO_RETRY).send()
      }
      try {
        fastify.db.webhookPayloads.insert(data)
        fastify.db.loki.save()
      }
      catch (err) {
        throw fastify.httpErrors.internalServerError(`Failed to store webhook payload: ${err}`)
      }
      fastify.log.info({ data }, 'Ko-fi Webhook Received')
      return reply.code(WEBHOOK_OK).send()
    }
  })
}
