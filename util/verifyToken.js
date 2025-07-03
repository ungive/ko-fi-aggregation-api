import { timingSafeEqual } from 'node:crypto'
import { Buffer } from 'node:buffer'

export function verifyToken(payloadToken, expectedToken) {
  if (typeof payloadToken !== 'string' || typeof expectedToken !== 'string') {
    return false
  }

  const buf1 = Buffer.from(payloadToken)
  const buf2 = Buffer.from(expectedToken)

  if (buf1.length !== buf2.length) {
    return false
  }

  try {
    return timingSafeEqual(buf1, buf2)
  } catch {
    return false
  }
}
