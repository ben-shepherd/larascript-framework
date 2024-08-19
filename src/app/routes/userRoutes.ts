import { Request, Response } from 'express';

import Route from "@src/core/domains/express/routing/Route";
import RouteGroup from "@src/core/domains/express/routing/RouteGroup";

const UserRoutes = RouteGroup([
    Route({
        name: 'index',
        method: 'get',
        path: '/',
        action: (req: Request, res: Response) => {
            res.send('Hello world!')
        } 
    }),
])

export default UserRoutes;