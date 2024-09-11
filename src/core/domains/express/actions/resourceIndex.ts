import Repository from '@src/core/base/Repository';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { IModel } from '@src/core/interfaces/IModel';
import { Response } from 'express';

/**
 * Finds all records in the resource's repository
 *
 * @param {BaseRequest} req - The request object
 * @param {Response} res - The response object
 * @param {IRouteResourceOptions} options - The options object
 * @returns {Promise<void>}
 */
export default async (req: BaseRequest, res: Response, options: IRouteResourceOptions): Promise<void> => {
    
    const repository = new Repository(options.resource);

    let results = await repository.findMany();
    results = results.map(result => result.getData({ excludeGuarded : true }) as IModel);

    res.send(results)
}