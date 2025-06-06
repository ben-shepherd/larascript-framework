import LocalMailDriver from "@src/core/domains/mail/adapters/LocalMailDriver";
import NodeMailDriver from "@src/core/domains/mail/adapters/NodeMailerDriver";
import { BaseMailAdapters } from "@src/core/domains/mail/interfaces/adapter";
import { IMailConfig } from "@src/core/domains/mail/interfaces/config";
import MailConfig from "@src/core/domains/mail/services/MailConfig";
import parseBooleanFromString from "@src/core/util/parseBooleanFromString";

/**
 * Provide type hinting when accessing passing names to the getDriver method in app('mail').getDriver(name)
 */
export interface MailAdapters extends BaseMailAdapters {
    local: LocalMailDriver
    nodemailer: NodeMailDriver
}

/**
 * Mail config for setting up different types of mail drivers
 * local - sends mail to the log file
 */
export const mailConfig: IMailConfig = {

    /**
     * The name of the default email driver 
     */
    default: process.env.MAIL_DRIVER ?? 'local',

    /**
     * Define additional mail drivers
     * Usage: app('mail').getDriver('nameOfDriver').send(mail)
     */
    drivers: MailConfig.drivers([
        MailConfig.define({
            name: 'local',
            driver: LocalMailDriver,
            options: {}
        }),
        MailConfig.define({
            name: 'nodemailer',
            driver: NodeMailDriver,
            options: {
                host: process.env.NODEMAILER_HOST ?? '',
                port: process.env.NODEMAILER_PORT ?? '',
                secure: parseBooleanFromString(process.env.NODEMAILER_SECURE, 'false'), // true for 465, false for other ports
                auth: {
                    user: process.env.NODEMAILER_AUTH_USER ?? '',
                    pass: process.env.NODEMAILER_AUTH_PASS ?? '',
                },
            }
        })
    ])
}

