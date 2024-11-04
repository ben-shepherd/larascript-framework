export type TSerializableValues = number | string | boolean | undefined | null;

export type TISerializablePayload = Record<string | number | symbol, unknown> | TSerializableValues;

export interface IEventPayloadWithDriver {
    driver: string;
    payload: TISerializablePayload
}