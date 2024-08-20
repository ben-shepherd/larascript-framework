import { Response } from 'express';
import { IRouteResourceOptions } from '../interfaces/IRouteResourceOptions';
import responseError from '../requests/responseError';
import { BaseRequest } from "../types/BaseRequest.t";

export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    try {
        const modelInstance = new options.resource(req.body);
        await modelInstance.save();

        res.status(201).send(modelInstance.getData({ excludeGuarded: true }) as IRouteResourceOptions['resource'])
    }
    catch (err) {
        if (err instanceof Error) {
            responseError(req, res, err)
        }

        res.status(500).send({ error: 'Something went wrong' })
    }
}