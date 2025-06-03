import { IMail, IMailOptions } from "../interfaces/data";

/**
 * Represents a mail message.
 * @template T - The type of mail options.
 */
class Mail<T extends IMailOptions = IMailOptions> implements IMail<T> {

    options: T;

    /**
     * Creates an instance of Mail.
     * @param options - The mail options.
     */
    constructor(options: T = {} as T) {
        this.options = options;
    }

    /**
     * Gets the mail options.
     * @returns The mail options.
     */
    getOptions(): T {
        return this.options
    }

    /**
     * Gets the recipient(s) of the email.
     * @returns The recipient(s) email address(es).
     */
    public getTo(): string | string[] {
        return this.options.to;
    }

    /**
     * Sets the recipient(s) of the email.
     * @param to - The recipient(s) email address(es).
     * @returns The Mail instance for chaining.
     */
    public setTo(to: string | string[]): this {
        this.options.to = to;
        return this
    }

    /**
     * Gets the sender of the email.
     * @returns The sender's email address.
     */
    public getFrom(): string {
        return this.options.from;
    }

    /**
     * Sets the sender of the email.
     * @param from - The sender's email address.
     * @returns The Mail instance for chaining.
     */
    public setFrom(from: string): this {
        this.options.from = from;
        return this;
    }

    /**
     * Gets the subject of the email.
     * @returns The email subject.
     */
    public getSubject(): string {
        return this.options.subject;
    }

    /**
     * Sets the subject of the email.
     * @param subject - The email subject.
     * @returns The Mail instance for chaining.
     */
    public setSubject(subject: string): this {
        this.options.subject = subject;
        return this;
    }

    /**
     * Gets the body of the email.
     * @returns The email body.
     */
    public getBody(): string {
        return this.options.body;
    }

    /**
     * Sets the body of the email.
     * @param body - The email body.
     * @returns The Mail instance for chaining.
     */
    public setBody(body: string): this {
        this.options.body = body;
        return this;
    }

    /**
     * Gets the attachments of the email.
     * @template T - The type of the attachments.
     * @returns An array of attachments or undefined.
     */
    public getAttachments<T>(): T[] | undefined {
        return this.options.attachments as T[];
    }

    /**
     * Sets the attachments of the email.
     * @param attachments - An array of attachments or undefined.
     * @returns The Mail instance for chaining.
     */
    public setAttachments(attachments: any[] | undefined): this {
        this.options.attachments = attachments;
        return this;
    }

}

export default Mail