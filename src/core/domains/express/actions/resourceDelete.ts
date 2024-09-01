import Repository from '@src/core/base/Repository';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import ModelNotFound from '@src/core/exceptions/ModelNotFound';
import { Response } from 'express';

export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    try {
        const modelInstance = new options.resource;
        const repository = new Repository(modelInstance.table, options.resource);

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