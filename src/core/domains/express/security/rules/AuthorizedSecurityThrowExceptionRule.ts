/**
 *     [securityIdentifiers.AUTHORIZED]: () => {
        id: SecurityIdentifiers.AUTHORIZED,
        when: null,
        never: null,
        arguements: {
            throwExceptionOnUnauthorized: true
        },
        callback: (req: BaseRequest) => authorizedSecurity(req)
    }
 */

import SecurityRule from "../../base/SecurityRule";
import { SecurityEnum } from "../../enums/SecurityEnum";
import AuthorizeMiddleware from "../../middleware/authorizeMiddleware";

class AuthorizedSecurityThrowExceptionRule extends SecurityRule {

    constructor() {
        super({
            id: SecurityEnum.AUTHORIZED,
            when: null,
            never: null,
            arguements: {
                throwExceptionOnUnauthorized: true
            },
            middleware: AuthorizeMiddleware.toExpressMiddleware()
        });
    }

}

export default AuthorizedSecurityThrowExceptionRule;