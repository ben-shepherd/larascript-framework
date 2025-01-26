import RouteGroupLegacy from "@src/core/domains/express/routing/RouteGroupLegacy"
import RouteLegacy from "@src/core/domains/express/routing/RouteLegacy"
import { Request, Response } from "express"

const apiRoutes = RouteGroupLegacy([
    RouteLegacy({
        name: 'index',
        method: 'get',
        path: '/',
        action: (req: Request, res: Response) => {
            res.send('OK!')
        }
    }),

])

export default apiRoutes