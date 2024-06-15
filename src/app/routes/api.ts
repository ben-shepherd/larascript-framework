import { IRoute } from "@src/core/interfaces/http/IRoute"
import { Request, Response } from "express"

const routes: IRoute[] = [
    {
        name: 'index',
        method: 'get',
        path: '/',
        action: (req: Request, res: Response) => {
            res.send('hello world')
        }
    }
]

export default routes