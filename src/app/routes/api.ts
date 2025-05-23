import ExampleController from "@src/app/controllers/ExampleController"
import Route from "@src/core/domains/http/router/Route"

export default Route.group(router => {

    router.get('/example', [ExampleController, 'example'])
    router.post('/fileupload', [ExampleController, 'fileupload'])
})
