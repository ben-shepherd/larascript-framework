import Mail from "@src/core/domains/mail/data/Mail";
import { MailAdapter } from "@src/core/domains/mail/interfaces/adapter";
import { app } from "@src/core/services/App";
import BaseMailAdapter from "@src/core/domains/mail/base/BaseMailAdapter";

class LocalMailDriver extends BaseMailAdapter implements MailAdapter {

    // eslint-disable-next-line no-unused-vars
    constructor(options: object = {}) { 
        super()
    }

    getOptions<T>(): T {
        return {} as T
    }

    async send(mail: Mail): Promise<void> {
        app('logger').info('Email', JSON.stringify({
            to: mail.getTo(),
            from: mail.getFrom(),
            subject: mail.getSubject(),
            body: await this.generateBodyString(mail),
            attachments: mail.getAttachments()
        }))
    }

}

export default LocalMailDriver