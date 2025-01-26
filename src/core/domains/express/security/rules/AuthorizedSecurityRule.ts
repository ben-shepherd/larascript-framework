import SecurityRule from "../../base/SecurityRule";
import { SecurityEnum } from "../../enums/SecurityEnum";
import AuthorizeMiddleware from "../../middleware/authorizeMiddleware";

class AuthorizedSecurityRule extends SecurityRule {

    constructor() {
        super({
            id: SecurityEnum.AUTHORIZED,
            when: null,
            never: null,
            middleware: AuthorizeMiddleware.toExpressMiddleware()
        });
    }

}

export default AuthorizedSecurityRule;