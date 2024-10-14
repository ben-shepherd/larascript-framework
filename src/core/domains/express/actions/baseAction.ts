import { IAction } from '@src/core/domains/express/interfaces/IAction';
import { IRouteResourceOptions } from '@src/core/domains/express/interfaces/IRouteResourceOptions';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { Response } from 'express';

/**
 * This function returns a new action function that calls the given action
 * function with the given options as the third argument.
 *
 * @param {IRouteResourceOptions} options The options that will be passed to the action as the third argument.
 * @param {IAction} action The action function that will be called with the BaseRequest, Response, and options.
 * @return {(req: BaseRequest, res: Response) => Promise<void>} A new action function that calls the given action with the given options.
 */
const baseAction = (options: IRouteResourceOptions, action: IAction) => (req: BaseRequest, res: Response) => action(req, res, options)

export default baseAction