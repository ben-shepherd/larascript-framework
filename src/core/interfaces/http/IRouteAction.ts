import { BaseRequest } from "@src/core/domains/express/types/BaseRequest";
import { Response } from "express";

export type IRouteAction = (req: BaseRequest, res: Response) => any;