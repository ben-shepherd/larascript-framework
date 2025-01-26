import SecurityRule from "../../base/SecurityRule";
import { SecurityEnum } from "../../enums/SecurityEnum";

class EnableScopeRule extends SecurityRule {

    constructor() {
        super({
            id: SecurityEnum.ENABLE_SCOPES,
            when: null,
            never: null,
            middleware: undefined
        });
    }

}

export default EnableScopeRule;