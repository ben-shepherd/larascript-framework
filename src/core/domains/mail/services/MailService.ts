import { MailAdapters } from "@src/config/mail.config";
import BaseAdapter from "@src/core/base/BaseAdapter";
import { app } from "@src/core/services/App";

import LocalMailDriver from "../adapters/LocalMailDriver";
import NodeMailDriver from "../adapters/NodeMailerDriver";
import { MailAdapter } from "../interfaces/adapter";
import { IMailConfig } from "../interfaces/config";
import { IMail } from "../interfaces/data";
import { IMailService } from "../interfaces/services";

/**
 * Short hand for app('mail')
 */
export const mail = () => app('mail')

class MailService extends BaseAdapter<MailAdapters> implements IMailService {

    config!: IMailConfig

    /**
     * Creates an instance of MailService.
     * @param config The mail configuration.
     */
    constructor(config: IMailConfig) {
        super()
        this.config = config
    }

    /**
     * Boots the MailService by adding the configured mail adapters.
     */
    boot(): void {
        this.config.drivers.forEach(driverConfig => {
            const adapterConstructor = driverConfig.driver
            this.addAdapterOnce(driverConfig.name, new adapterConstructor(driverConfig.options))
        })
    }

    /**
     * Sends an email using the default mail driver.
     * @param mail The email data.
     * @returns A promise that resolves when the email is sent.
     */
    async send(mail: IMail): Promise<void> {
        return await this.getDefaultDriver().send(mail)
    }

    /**
     * Gets the default mail driver.
     * @returns The default MailAdapter.
     */
    getDefaultDriver(): MailAdapter {
        return this.getAdapter(this.config.default)
    }

    /**
     * Gets a specific mail driver by name.
     * @template T The expected type of the mail adapter.
     * @param name The name of the mail adapter.
     * @returns The specified MailAdapter.
     */
    getDriver<T extends MailAdapter = MailAdapter>(name: keyof MailAdapters): T {
        return this.getAdapter(name) as T
    }

    /**
     * Gets the local mail driver.
     * @returns The LocalMailDriver instance.
     */
    local(): LocalMailDriver {
        return this.getAdapter('local') as LocalMailDriver
    }

    nodeMailer(): NodeMailDriver {
        return this.getAdapter('nodemailer') as NodeMailDriver
    }

}

export default MailService