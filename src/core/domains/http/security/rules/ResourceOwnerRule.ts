
import ResourceException from "@src/core/domains/express/exceptions/ResourceException";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import AbstractSecurityRule from "@src/core/domains/http/security/abstract/AbstractSecurityRule";
import { IModel } from "@src/core/interfaces/IModel";

import { SecurityEnum } from "../../enums/SecurityEnum";
import { RouteResourceTypes } from "../../router/RouterResource";

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