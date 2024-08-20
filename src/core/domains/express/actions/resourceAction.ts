import { Response } from 'express';
import { IAction } from '../interfaces/IAction';
import { IRouteResourceOptions } from '../interfaces/IRouteResourceOptions';
import { BaseRequest } from '../types/BaseRequest.t';

const ResourceAction = (options: IRouteResourceOptions, action: IAction) => {
    return (req: BaseRequest, res: Response) => {
        return action(req, res, options)
    }
}

export default ResourceAction