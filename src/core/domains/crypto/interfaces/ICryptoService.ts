/* eslint-disable no-unused-vars */
import { BufferEncoding } from "@src/core/domains/crypto/interfaces/BufferingEncoding.t"

export interface ICryptoService {
    generateBytesAsString(length?: number, encoding?: BufferEncoding): string
    encrypt(string: string): string
    decrypt(string: string): string
    hash(string: string): string
    verifyHash(string: string, hashWithSalt: string): boolean
    generateAppKey(): string
}
