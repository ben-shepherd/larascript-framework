/* eslint-disable no-unused-vars */
export interface IFormatter<Options = unknown> {
    formatterOptions?: Options;

    format<T = unknown>(...args: any[]): T;
    setFormatterOptions(options?: Options): this;
    getFormatterOptions(): Options | undefined;
}