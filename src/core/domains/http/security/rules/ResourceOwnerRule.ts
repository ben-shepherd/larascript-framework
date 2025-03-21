
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { SecurityEnum } from "@src/core/domains/http/enums/SecurityEnum";
import { RouteResourceTypes } from "@src/core/domains/http/router/RouterResource";
import AbstractSecurityRule from "@src/core/domains/http/security/abstract/AbstractSecurityRule";
import { IModel } from "@src/core/domains/models/interfaces/IModel";

type TResourceOwnerRuleOptions = {
    attribute: string;
}

export type TRouteResourceTypes = (typeof RouteResourceTypes)[keyof typeof RouteResourceTypes]

class ResourceOwnerRule extends AbstractSecurityRule<TResourceOwnerRuleOptions, TRouteResourceTypes, TRouteResourceTypes> {

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