import HelloWorldController from "@src/core/domains/express/actions/helloWorldController";
import BasicLoggerMiddleware from "@src/core/domains/express/middleware/BasicLoggerMiddleware";
import Route from "@src/core/domains/http/router/Route";

const helloWorldRoutes = Route.group({
    prefix: '/hello',
    name: 'hello.',
    middlewares: BasicLoggerMiddleware,
    controller: HelloWorldController,
}, routes => {

    routes.group({
        prefix: '/world',
        name: 'world',
    }, routes => {
        routes.get('/', 'helloWorld')
    })
    
    routes.get('/', 'index')
    routes.post('/', 'create')
    routes.get('/{id}', 'show')
    routes.put('/{id}', 'update')
    routes.delete('/{id}', 'delete')



})

export default helloWorldRoutes