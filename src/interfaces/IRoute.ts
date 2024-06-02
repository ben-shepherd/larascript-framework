import { Request, Response } from 'express';


export interface IRoute {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    handler: (req: Request, res: Response) => void;
}