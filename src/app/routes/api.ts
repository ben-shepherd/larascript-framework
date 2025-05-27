import ExampleController from "@src/app/controllers/ExampleController"
import Route from "@src/core/domains/http/router/Route"

import FileUploadValidator from "../validators/FileUploadValidator"

export default Route.group(router => {

    router.get('/example', [ExampleController, 'example'])

})
