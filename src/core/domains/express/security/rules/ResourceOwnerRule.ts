
import AbstractSecurityRule from "../../abstract/AbstractSecurityRule";
import HttpContext from "../../data/HttpContext";

type TResourceOwnerRuleOptions = {
    primaryKey: string;
}

class ResourceOwnerRule extends AbstractSecurityRule<TResourceOwnerRuleOptions> {

    async execute(context: HttpContext): Promise<boolean> {
        const user = context.getUser();

        if(!user) {
            return false;
        }
    
        // if(typeof resource.getAttributeSync !== 'function') {
        //     throw new Error('Resource is not an instance of IModel');
        // }
    
        // return resource.getAttributeSync(attribute) === user?.getId()
        return false;
    }

}

export default ResourceOwnerRule;