
import AbstractSecurityRule from "../../abstract/AbstractSecurityRule";
import HttpContext from "../../data/HttpContext";
import { SecurityEnum } from "../../enums/SecurityEnum";
import SecurityException from "../../exceptions/SecurityException";

type THasRoleRuleOptions = {
    roles: string | string[];
}

class HasRoleRule extends AbstractSecurityRule<THasRoleRuleOptions> {

    protected id = SecurityEnum.HAS_ROLE;

    async execute(context: HttpContext): Promise<boolean> {
        const user = context.getUser();

        if(!user) {
            return false;
        }

        const roles = this.getRuleOptions().roles;

        if(!roles) {
            throw new SecurityException('Roles are required');
        }

        const rolesArr = Array.isArray(roles) ? roles : [roles];

        if(rolesArr.length === 0) {
            throw new SecurityException('No roles provided');
        }

        return user.hasRole(rolesArr);
    }

}

export default HasRoleRule;