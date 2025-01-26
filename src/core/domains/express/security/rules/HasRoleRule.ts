
import SecurityRule from "../../base/SecurityRule";
import { SecurityEnum } from "../../enums/SecurityEnum";
import HasRoleMiddleware from "../middleware/HasRoleMiddleware";

class HasRoleRule extends SecurityRule {

    constructor(roles: string | string[]) {
        super({
            id: SecurityEnum.HAS_ROLE,
            also: SecurityEnum.AUTHORIZED,
            when: null,
            never: null,
            middleware: HasRoleMiddleware.toExpressMiddleware(roles)
        });
    }

}

export default HasRoleRule;