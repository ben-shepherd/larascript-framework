import LocalMailDriver from "@src/core/domains/mail/adapters/LocalMailDriver";
import { BaseMailAdapters } from "@src/core/domains/mail/interfaces/adapter";
import { IMailConfig } from "@src/core/domains/mail/interfaces/config";
import MailConfig from "@src/core/domains/mail/services/MailConfig";

/**
 * Provide type hinting when accessing passing names to the getDriver method in app('mail').getDriver(name)
 */
export interface MailAdapters extends BaseMailAdapters {
    local: LocalMailDriver
}

/**
 * Mail config for setting up different types of mail drivers
 * local - sends mail to the log file
 */
export const mailConfig: IMailConfig = {

    /**
     * The name of the default email driver 
     */
    default: 'local',

    /**
     * Define additional mail drivers
     * Usage: app('mail').getDriver('nameOfDriver').send(mail)
     */
    drivers: MailConfig.drivers([
        MailConfig.define({
            name: 'local',
            driver: LocalMailDriver,
            options: {}
        })
    ])
}

