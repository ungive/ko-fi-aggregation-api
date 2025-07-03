'use strict'

import fp from 'fastify-plugin'
import fastifyFormbody from '@fastify/formbody'

export default fp(async function (fastify, opts) {
  fastify.register(fastifyFormbody, {
    errorHandler: false
  })
})
