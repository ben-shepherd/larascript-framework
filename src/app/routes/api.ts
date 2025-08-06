import WelcomeController from "@src/app/controllers/WelcomeController"
import Route from "@src/core/domains/http/router/Route"

export default Route.group(router => {

    router.get('/', WelcomeController)
    
})
