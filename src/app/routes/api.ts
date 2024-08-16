import { IRoute } from "@src/core/domains/express/interfaces/IRoute"
import { Request, Response } from "express"

const routes: IRoute[] = [
    {
        name: 'index',
        method: 'get',
        path: '/',
        action: (req: Request, res: Response) => {
            res.send('OK')
        }
    }
]

export default routes