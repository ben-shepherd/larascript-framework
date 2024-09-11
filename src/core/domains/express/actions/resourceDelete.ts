import Repository from '@src/core/base/Repository';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import ModelNotFound from '@src/core/exceptions/ModelNotFound';
import { Response } from 'express';

/**
 * Deletes a resource
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptions} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    try {
        const repository = new Repository(options.resource);

        const result = await repository.findById(req.params?.id);

        if (!result) {
            throw new ModelNotFound('Resource not found');
        }

        await result.delete();

        res.send({ success: true })
    }
    catch (err) {
        if(err instanceof ModelNotFound) {
            responseError(req, res, err, 404)
        }
        if (err instanceof Error) {
            responseError(req, res, err)
        }

        res.status(500).send({ error: 'Something went wrong' })
    }
}