'use strict'

import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import AutoLoad from '@fastify/autoload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const options = {}

export default async function (fastify, opts) {
  
  // ...

  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}

const _options = options
export { _options as options }
