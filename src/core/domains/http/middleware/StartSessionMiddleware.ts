import Middleware from "@src/core/domains/http/base/Middleware";
import HttpContext from "@src/core/domains/http/context/HttpContext";

class StartSessionMiddleware extends Middleware {

    async execute(context: HttpContext): Promise<void> {
        
    }

}


export default StartSessionMiddleware