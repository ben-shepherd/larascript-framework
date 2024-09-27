import { IRoute } from '@src/core/domains/express/interfaces/IRoute';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { NextFunction, Request, Response } from 'express';

/**
 * Authorize Security props
 */
export interface ISecurityAuthorizeProps {
    throwExceptionOnUnauthorized?: boolean
}

/**
 * The callback function
 */
// eslint-disable-next-line no-unused-vars
export type SecurityCallback = (req: BaseRequest, ...args: any[]) => boolean;

/**
 * An interface for defining security callbacks with an identifier.
 * 
 * id - The identifier for the security callback.
 * also - The security rule to include in the callback.
 * when - The condition for when the security check should be executed. Defaults to 'always'.
 * never - The condition for when the security check should never be executed.
 * callback - The security callback function.
 */
export type IIdentifiableSecurityCallback = {
    id: string;
    also?: string | null;
    when: string[] | null;
    never: string[] | null;
    arguements?: Record<string, unknown>;
    callback: SecurityCallback;
}

// eslint-disable-next-line no-unused-vars
export type ISecurityMiddleware = ({ route }: { route: IRoute }) => (req: BaseRequest, res: Response, next: NextFunction) => Promise<void>;

/**
 * Security request to be included in BaseRequest
 */
export default interface ISecurityRequest extends Request {
    security?: IIdentifiableSecurityCallback[]
}