import { MailAdapters } from "@src/config/mail.config";
import BaseAdapter from "@src/core/base/BaseAdapter";

import LocalMailDriver from "../adapters/LocalMailDriver";
import { MailAdapter } from "../interfaces/adapter";
import { IMailConfig } from "../interfaces/config";
import { IMail } from "../interfaces/data";
import { IMailService } from "../interfaces/services";

class MailService extends BaseAdapter<MailAdapters> implements IMailService {

    config!: IMailConfig

    constructor(config: IMailConfig) {
        super()
        this.config = config
    }

    boot(): void {
        this.config.drivers.forEach(driverConfig => {
            const adapterConstructor = driverConfig.driver
            this.addAdapterOnce(driverConfig.name, new adapterConstructor(driverConfig.options))
        })
    }

    async send(mail: IMail): Promise<void> {
        return await this.getDefaultDriver().send(mail)
    }

    getDefaultDriver(): MailAdapter {
        return this.getAdapter(this.config.default)
    }

    getDriver<T extends MailAdapter = MailAdapter>(name: keyof MailAdapters): T {
        return this.getAdapter(name) as T
    }

    local(): LocalMailDriver {
        return this.getAdapter('local') as LocalMailDriver
    }

}

export default MailService