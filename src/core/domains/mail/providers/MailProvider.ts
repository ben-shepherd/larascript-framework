import { mailConfig } from "@src/config/mail.config";
import BaseProvider from "@src/core/base/Provider";
import { app } from "@src/core/services/App";
import { IMailConfig } from "@src/core/domains/mail/interfaces/config";
import MailService from "@src/core/domains/mail/services/MailService";

class MailProvider extends BaseProvider {

    config: IMailConfig = mailConfig

    async register(): Promise<void> {
        this.bind('mail', new MailService(this.config))
    }

    async boot(): Promise<void> {
        app('mail').boot()
    }

}

export default MailProvider