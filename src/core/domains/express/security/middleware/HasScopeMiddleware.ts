
import Middleware from "../../base/Middleware";
import HttpContext from "../../data/HttpContext";

class HasScopeMiddleware extends Middleware {

    private scopesExactMatch: string | string[];

    private scopesPartialMatch: string | string[];

    constructor(scopesExactMatch: string | string[], scopesPartialMatch: string | string[]) {
        super();
        this.scopesExactMatch = scopesExactMatch;
        this.scopesPartialMatch = scopesPartialMatch;
    }

    /**
     * Checks if the request is authorized, i.e. if the user is logged in.
     * Throws an exception on unauthorized requests.
     * @param context The HTTP context
     */
    async execute(context: HttpContext): Promise<void> {
        const apiToken = context.getApiToken();

        if(!apiToken) {
            return;
        }
    
        if(this.scopesPartialMatch.length && !apiToken.hasScope(this.scopesPartialMatch, false)) {
            return;
        }
    
        if(this.scopesExactMatch.length && !apiToken.hasScope(this.scopesExactMatch, true)) {
            return;
        }

        this.next()
    }

}

export default HasScopeMiddleware;