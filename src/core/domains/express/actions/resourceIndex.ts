import Repository from '@src/core/base/Repository';
import { IModel } from '@src/core/interfaces/IModel';
import { Response } from 'express';
import { IRouteResourceOptions } from '../interfaces/IRouteResourceOptions';
import { BaseRequest } from "../types/BaseRequest.t";

export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    
    const modelInstance = new options.resource;
    const repository = new Repository(modelInstance.collection, options.resource);

    let results = await repository.findMany();
    results = results.map(result => result.getData({ excludeGuarded : true }) as IModel);

    res.send(results)
}