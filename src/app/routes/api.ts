import Route from "@src/core/domains/express/routing/Route"
import RouteGroup from "@src/core/domains/express/routing/RouteGroup"
import RouteResource from "@src/core/domains/express/routing/RouteResource"
import { Request, Response } from "express"

const apiRoutes = RouteGroup([

    // Single route
    Route({
        name: 'index',
        method: 'get',
        path: '/',
        action: (req: Request, res: Response) => {
            res.send('OK!')
        }
    }),

    // Auto generated routes
    ...RouteResource({
        name: 'blog',
        resource: BlogModel,
        createValidator: BlogCreateValidator,
        updateValidator: BlogUpdateValidator,
        except: ['destory'],
    })
])

export default apiRoutes