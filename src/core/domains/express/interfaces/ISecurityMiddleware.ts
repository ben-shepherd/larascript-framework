import { IRoute } from '@src/core/domains/express/interfaces/IRoute';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { NextFunction, Response } from 'express';


// eslint-disable-next-line no-unused-vars
export type ISecurityMiddleware = ({ route }: { route: IRoute }) => (req: BaseRequest, res: Response, next: NextFunction) => Promise<void>;