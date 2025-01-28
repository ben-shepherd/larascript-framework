
import { IModel } from "@src/core/interfaces/IModel";
import AbstractSecurityRule from "@src/core/domains/express/abstract/AbstractSecurityRule";
import HttpContext from "@src/core/domains/express/data/HttpContext";
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import { SecurityIdentifiersLegacy } from "@src/core/domains/express/services/SecurityRulesLegacy";

type TResourceOwnerRuleOptions = {
    attribute: string;
}

class ResourceOwnerRule extends AbstractSecurityRule<TResourceOwnerRuleOptions> {

    protected id = SecurityIdentifiersLegacy.RESOURCE_OWNER;

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