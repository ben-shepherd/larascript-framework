import { Response } from 'express';
import { IAction } from '@src/core/domains/express/interfaces/IAction';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';

const ResourceAction = (options: IRouteResourceOptions, action: IAction) => {
    return (req: BaseRequest, res: Response) => {
        return action(req, res, options)
    }
}

export default ResourceAction