import crypto from 'crypto'

export default (size: number = 64, bufferEncoding: BufferEncoding = 'hex'): string => crypto.randomBytes(size).toString(bufferEncoding)
