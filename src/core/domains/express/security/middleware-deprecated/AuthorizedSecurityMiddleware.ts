
import Middleware from "@src/core/domains/express/base/Middleware";
import HttpContext from "@src/core/domains/express/data/HttpContext";

class AuthorizedSecurityMiddleware extends Middleware {

    /**
     * Checks if the request is authorized, i.e. if the user is logged in.
     * Throws an exception on unauthorized requests.
     * @param context The HTTP context
     */
    async execute(context: HttpContext): Promise<void> {
        if(!context.getByRequest('userId')) {
            return;
        }

        this.next()
    }

}

export default AuthorizedSecurityMiddleware;