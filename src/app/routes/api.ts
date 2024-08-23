import Route from "@src/core/domains/express/routing/Route"
import RouteGroup from "@src/core/domains/express/routing/RouteGroup"
import RouteResource from "@src/core/domains/express/routing/RouteResource"
import { Request, Response } from "express"
import User from "@src/app/models/auth/User"
import CreateUserValidator from "@src/app/validators/user/CreateUserValidator"
import UpdateUserValidator from "@src/app/validators/user/UpdateUserValidator"

const routes = RouteGroup([
    Route({
        name: 'index',
        method: 'get',
        path: '/',
        action: (req: Request, res: Response) => {
            res.send('Hello world!')
        }
    }),
    ...RouteResource({
        resource: User,
        name: 'users',
        except: ['index'],
        only: ['show'],
        createValidator: CreateUserValidator,
        updateValidator: UpdateUserValidator
    })
])

export default routes