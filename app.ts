import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import fastifyAutoload from '@fastify/autoload'
import dotenv from 'dotenv'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

dotenv.config()

const token = process.env.KO_FI_VERIFICATION_TOKEN
if (!token || token.length < 8) {
  console.error('Missing KO_FI_VERIFICATION_TOKEN environment variable')
  process.exit(1)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const options = {}

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {

  fastify.withTypeProvider<TypeBoxTypeProvider>()

  fastify.register(fastifyAutoload, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(fastifyAutoload, {
    dir: join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}

const _options = options
export { _options as options }
