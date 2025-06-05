/* eslint-disable no-unused-vars */
import { BaseAdapterTypes } from "@src/core/base/BaseAdapter";

import { IMail } from "./data";

export type BaseMailAdapters = BaseAdapterTypes<MailAdapter> & {
    local: MailAdapter
}

export type MailAdapterConstructor = new (options: any) => MailAdapter

export interface MailAdapter {
    send(mail: IMail): Promise<void>
    getOptions<T>(): T
}