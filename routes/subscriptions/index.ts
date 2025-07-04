import { FastifyInstance } from 'fastify'

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    return fastify.db.webhookPayloads
      .chain()
      .find({ type: 'Subscription' })
      .where(data => data.is_subscription_payment)
      .simplesort('timestamp')
      .data()
  })
}
