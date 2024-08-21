import Repository from '@src/core/base/Repository';
import ModelNotFound from '@src/core/exceptions/ModelNotFound';
import { IModel } from '@src/core/interfaces/IModel';
import { Response } from 'express';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";

export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    try {
        const modelInstance = new options.resource;
        const repository = new Repository(modelInstance.collection, options.resource);

        const result = await repository.findById(req.params?.id);

        if (!result) {
            throw new ModelNotFound('Resource not found');
        }

        result.fill(req.body);
        await result.save();

        res.send(result?.getData({ excludeGuarded: true }) as IModel);
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