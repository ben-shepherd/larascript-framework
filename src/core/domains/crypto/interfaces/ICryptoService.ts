/* eslint-disable no-unused-vars */
import { BufferEncoding } from "./BufferingEncoding.t"

export interface ICryptoService {
    generateBytesAsString(length?: number, encoding?: BufferEncoding): string
}
