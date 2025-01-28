

import Middleware from "@src/core/domains/express/base/Middleware";
import HttpContext from "@src/core/domains/express/data/HttpContext";

class HasRoleMiddleware extends Middleware {

    private roles!: string | string[];

    constructor(roles: string | string[]) {
        super();
        this.roles = roles;
    }

    async execute(context: HttpContext): Promise<void> {
        const user = context.getUser();

        if(!user) {
            return;
        }
    
        if(!user?.hasRole(this.roles)) {
            return;
        }

        this.next()
    }

}

export default HasRoleMiddleware;