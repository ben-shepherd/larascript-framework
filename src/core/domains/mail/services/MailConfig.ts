import { IMailConfig, MailAdapterConfigItem } from "@src/core/domains/mail/interfaces/config"

class MailConfig {

    public static drivers(drivers: IMailConfig['drivers']): IMailConfig['drivers'] {
        return drivers
    }

    public static define({ name, driver, options = {} }: MailAdapterConfigItem): MailAdapterConfigItem {
        return { name, driver, options }
    }

}

export default MailConfig