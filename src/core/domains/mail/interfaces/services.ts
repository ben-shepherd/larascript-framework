/* eslint-disable no-unused-vars */
import { MailAdapters } from "@src/config/mail.config";
import { MailAdapter } from "@src/core/domains/mail/interfaces/adapter";
import { IMail } from "@src/core/domains/mail/interfaces/data";

export interface IMailService {
    boot(): void;
    send(mail: IMail): Promise<void>;
    getDefaultDriver(): MailAdapter;
    getDriver<T extends MailAdapter = MailAdapter>(name: keyof MailAdapters): T;
    local(): MailAdapter;
    nodeMailer(): MailAdapter;
    resend(): MailAdapter;
}