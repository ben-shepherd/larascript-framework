import { IModel } from "@src/core/interfaces/IModel";

import SecurityRule from "../../base/SecurityRule";
import { SecurityEnum } from "../../enums/SecurityEnum";
import ResourceOwnerMiddleware from "../middleware/ResourceOwnerMiddleware";

class ResourceOwnerRule extends SecurityRule {

    constructor(model: IModel, attribute: string = 'userId') {
        super({
            id: SecurityEnum.RESOURCE_OWNER,
            also: SecurityEnum.AUTHORIZED,
            when: null,
            never: null,
            middleware: ResourceOwnerMiddleware.toExpressMiddleware(model, attribute)
        });
    }

}

export default ResourceOwnerRule;