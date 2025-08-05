import { app } from "@src/core/services/App";

import { IMail } from "../interfaces/data";

abstract class BaseMailAdapter {

    async generateBodyString(mail: IMail): Promise<string> {
        const body = mail.getBody();

        if(typeof body === 'string') {
            return body
        }

        const { view, data = {} } = body

        return await app('view').render({
            view,
            data
        })
    }

}

export default BaseMailAdapter;