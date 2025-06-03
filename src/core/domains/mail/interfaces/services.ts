/* eslint-disable no-unused-vars */
import { MailAdapters } from "@src/config/mail.config";

import { MailAdapter } from "./adapter";
import { IMail } from "./data";

export interface IMailService {
    boot(): void;
    send(mail: IMail): Promise<void>;
    getDefaultDriver(): MailAdapter;
    getDriver<T extends MailAdapter = MailAdapter>(name: keyof MailAdapters): T;
    local(): MailAdapter;
}