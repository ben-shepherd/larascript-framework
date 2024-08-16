import { Request, Response } from 'express';

export default (req: Request , res: Response, err: Error, code: number = 422) => {
    res.status(code).send({ error: err.message })
}