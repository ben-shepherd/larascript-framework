import { Request } from 'express';
import { IdentifiableSecurityCallback } from '@src/core/domains/auth/services/Security';

export default interface ISecurityRequest extends Request {
    security?: IdentifiableSecurityCallback[]
}