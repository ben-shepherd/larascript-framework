import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { NextFunction, Response } from 'express';

import { IRoute } from '@src/core/domains/express/interfaces/IRoute';
import ForbiddenResourceError from '@src/core/domains/auth/exceptions/ForbiddenResourceError';
import { SecurityIdentifiers } from '@src/core/domains/auth/services/Security';

// eslint-disable-next-line no-unused-vars
export type ISecurityMiddleware = ({ route }: { route: IRoute }) => (req: BaseRequest, res: Response, next: NextFunction) => Promise<void>;

/**
 * This middleware will check the security definition of the route and validate it.
 * If the security definition is not valid, it will throw an UnauthorizedError.
 *
 * @param {{ route: IRoute }} - The route object
 * @returns {(req: BaseRequest, res: Response, next: NextFunction) => Promise<void>}
 */
export const securityMiddleware = ({ route }) => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Attach security to the request object 
        req.security = route?.security ?? [];

        // Check if the hasRole security has been defined and validate
        const hasRoleSecurity = req.security?.find((security) => security.id === SecurityIdentifiers.HAS_ROLE);

        if(hasRoleSecurity && !hasRoleSecurity.callback()) {
            responseError(req, res, new ForbiddenResourceError(), 403)
            return;
        }

        // Security passed
        next();
    }
    catch (error) {
        if(error instanceof UnauthorizedError) {
            responseError(req, res, error, 401)
            return;
        }

        if(error instanceof Error) {
            responseError(req, res, error)
        }
    }
};