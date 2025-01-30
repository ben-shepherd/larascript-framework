
import AbstractSecurityRule from "@src/core/domains/express/abstract/AbstractSecurityRule";
import HttpContext from "@src/core/domains/express/data/HttpContext";
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import { IModel } from "@src/core/interfaces/IModel";

import { SecurityEnum } from "../../enums/SecurityEnum";

type TResourceOwnerRuleOptions = {
    attribute: string;
}

class ResourceOwnerRule extends AbstractSecurityRule<TResourceOwnerRuleOptions> {

    protected readonly id = SecurityEnum.RESOURCE_OWNER;

    async execute(context: HttpContext, resource: IModel): Promise<boolean> {
        const user = context.getUser();

        if(!user) {
            return false;
        }
        
        const attribute = this.getRuleOptions().attribute;

        if(!attribute) {
            throw new ResourceException('Attribute is required');
        }
    
        return resource.getAttributeSync(attribute) === user?.getId()
    }

}

export default ResourceOwnerRule;