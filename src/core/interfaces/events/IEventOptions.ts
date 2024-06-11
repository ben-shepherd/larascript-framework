export type IEventSerializableTypes = number | string | boolean | undefined;

export interface IEventOptions {
    [key: string]: IEventSerializableTypes
}