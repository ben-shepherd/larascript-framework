import Route from "@src/core/domains/http/router/Route"
import { Request, Response } from "express"

export default Route.group(router => {
    router.get('/', (req: Request, res: Response) => {
        res.send('OK!')
    })
})
