export type TSerializableTypes = number | string | boolean | undefined;

export interface IEventPayload {
    [key: string | number | symbol]: TSerializableTypes
}

export interface IEventPayloadWithDriver {
    driver: string;
    payload: IEventPayload
}