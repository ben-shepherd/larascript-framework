import SecurityRule from "../../base/SecurityRule";
import { SecurityEnum } from "../../enums/SecurityEnum";
import HasScopeMiddleware from "../middleware/HasScopeMiddleware";

class EnableScopeRule extends SecurityRule {

    constructor(scopesExactMatch: string | string[] = [], scopesPartialMatch: string | string[] = []) {
        super({
            id: SecurityEnum.HAS_SCOPE,
            when: null,
            never: null,
            middleware: HasScopeMiddleware.toExpressMiddleware(scopesExactMatch, scopesPartialMatch)
        });
    }

}

export default EnableScopeRule;