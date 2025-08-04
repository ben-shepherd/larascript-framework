import { IMailBody, IMailBodyData } from "../interfaces/data";

class MailBody implements IMailBody {

    // eslint-disable-next-line no-unused-vars
    constructor(protected readonly options: IMailBodyData) {}

    static create(view: string, data: Record<string, unknown> = {}, layout: string = 'base-email') {
        return new MailBody({
            view,
            data,
            layout
        })
    }

    getView(): string {
        return this.options.view;
    }

    getData(): Record<string, unknown> {
        return this.options.data
    }

    getLayout(): string {
        return this.options.layout
    }

}

export default MailBody