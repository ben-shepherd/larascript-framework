/* eslint-disable no-unused-vars */
export interface IMailOptions {
    to: string | string[];
    from: string;
    subject: string;
    body: string;
    attachments?: any[];
}

export interface IMail<T extends IMailOptions = IMailOptions> {
    getOptions(): T
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
}