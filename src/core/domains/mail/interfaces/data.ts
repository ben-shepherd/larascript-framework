/* eslint-disable no-unused-vars */
export interface IMailOptions {
    to: string | string[];
    from: string;
    subject: string;
    body: string | IMailBody;
    attachments?: any[];
    options?: Record<string, unknown>
}

export interface IMailBodyData {
    view: string;
    data: Record<string, unknown>;
    layout: string;
}

export interface IMail<T extends IMailOptions = IMailOptions> {
    getConfig(): T
    getOptions<Options extends Record<string, unknown>>(): Options;
    getTo(): string | string[];
    setTo(to: string | string[]): void;
    getFrom(): string;
    setFrom(from: string): void;
    getSubject(): string;
    setSubject(subject: string): void;
    getBody(): string;
    setBody(body: string): void;
    getAttachments<T>(): T[] | undefined;
    setAttachments(attachments: any[] | undefined): void;
    getTemplate(): IMailBody | undefined;
    setTemplate(template?: IMailBody): void;
}

export interface IMailBody {
    getView(): string;
    getData(): Record<string, unknown>;
    getLayout(): string;
}