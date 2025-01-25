import { generateUuidV4 } from "@src/core/util/uuid/generateUuidV4";

import HttpContext from "../base/HttpContext";
import Middleware from "../base/Middleware";

type Props = {
    // eslint-disable-next-line no-unused-vars
    generator: (...args: any[]) => string;
    setHeader: boolean;
    headerName: string;
}

const defaultProps: Props = {
    generator: generateUuidV4,
    setHeader: true,
    headerName: 'X-Request-Id'
}

/**
 * Middleware to add a request ID to the request and response objects.
 */
class RequestIdMiddleware extends Middleware<Props> {

    constructor({ generator, setHeader, headerName }: Props = defaultProps) {
        super()
        this.setConfig({
            generator,
            setHeader,
            headerName
        })
    }

    async execute(context: HttpContext): Promise<void> {
        const { generator, setHeader, headerName } = this.getConfig()
        
        const oldValue = context.getRequest().get(headerName)
        const id =  oldValue ?? generator()
    
        if(setHeader) {
            context.getResponse().set(headerName, id)
        }
    
        context.getRequest().id = id
        this.next()
    }

}


export default RequestIdMiddleware