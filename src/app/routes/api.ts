import ExampleController from "@src/app/controllers/ExampleController"
import Route from "@src/core/domains/http/router/Route"

import ProfileAvatarController from "../controllers/ProfileAvatarController"

export default Route.group(router => {

    router.get('/example', [ExampleController, 'example'])

    // Profile Routes
    router.post('auth/account/avatar', ProfileAvatarController)
    
})
