import { app } from "@src/core/services/App"
import crypto from 'crypto'

import { BufferEncoding } from "../interfaces/BufferingEncoding.t"
import { ICryptoService } from "../interfaces/ICryptoService"

// Alias for app('crypto')
export const cryptoService = () => app('crypto')

class CryptoService implements ICryptoService {

    constructor() {
        
    }

    /**
     * Generate a new app key
     */
    generateBytesAsString(length: number = 32, encoding: BufferEncoding = 'hex') {
        return crypto.randomBytes(length).toString(encoding)
    }

}

export default CryptoService
