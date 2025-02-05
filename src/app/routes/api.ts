import Route from "@src/core/domains/http/router/Route"
import ExampleController from "@src/app/controllers/ExampleController"

export default Route.group(router => {

    router.get('/', [ExampleController, 'example'])
    
})
