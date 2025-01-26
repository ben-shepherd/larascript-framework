
import { IModel } from "@src/core/interfaces/IModel";

import Middleware from "../../base/Middleware";
import HttpContext from "../../data/HttpContext";

class ResourceOwnerMiddleware extends Middleware {

    private resource!: IModel;

    private attribute!: string;

    constructor(model: IModel, attribute: string = 'userId') {
        super();
        this.resource = model;
        this.attribute = attribute;
    }

    async execute(context: HttpContext): Promise<void> {
        const user = context.getUser();

        if(!user) {
            return;
        }
    
        if(typeof this.resource.getAttributeSync !== 'function') {
            throw new Error('Resource is not an instance of IModel');
        }
    
        if(this.resource.getAttributeSync(this.attribute) !== user?.getId()) {
            return;
        }

        this.next()
    }

}

export default ResourceOwnerMiddleware;