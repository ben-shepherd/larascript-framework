import Route from "@src/core/domains/express/routing/Route"
import RouteGroup from "@src/core/domains/express/routing/RouteGroup"
import { Request, Response } from "express"

const apiRoutes = RouteGroup([
    Route({
        name: 'index',
        method: 'get',
        path: '/',
        action: (req: Request, res: Response) => {
            res.send('OK!')
        }
    })
])

export default apiRoutes