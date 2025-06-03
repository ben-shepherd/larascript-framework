import { app } from "@src/core/services/App";

import Mail from "../data/Mail";
import { MailAdapter } from "../interfaces/adapter";

class LocalMailDriver implements MailAdapter {

    // eslint-disable-next-line no-unused-vars
    constructor(options: object = {}) { }

    getOptions<T extends Record<string, unknown>>(): T {
        return {} as T
    }

    async send(mail: Mail): Promise<void> {
        app('logger').info('Email', JSON.stringify({
            to: mail.getTo(),
            from: mail.getFrom(),
            subject: mail.getSubject(),
            body: mail.getBody(),
            attachments: mail.getAttachments()
        }))
    }

}

export default LocalMailDriver