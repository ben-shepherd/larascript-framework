export type TSerializableTypes = number | string | boolean | undefined;

export interface IEventPayload {
    [key: string | number | symbol]: TSerializableTypes
}