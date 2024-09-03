
export interface IDatabaseGenericConnectionConfig<Options extends object = object> {
    driver: string;
    uri: string,
    options: Options;
}