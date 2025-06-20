import { app } from "@src/core/services/App";
import Mail from "@src/core/domains/mail/data/Mail";
import { MailAdapter } from "@src/core/domains/mail/interfaces/adapter";

class LocalMailDriver implements MailAdapter {

    // eslint-disable-next-line no-unused-vars
    constructor(options: object = {}) { }

    getOptions<T>(): T {
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