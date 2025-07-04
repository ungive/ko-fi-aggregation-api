import { FastifyInstance } from 'fastify'

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    return fastify.db.webhookPayloads
      .chain()
      .find({ type: 'Donation' })
      .simplesort('timestamp')
      .data()
  })
}
