import { ISerializableTypes } from "../ISerializableTypes";

export interface IEventPayload {
    [key: string | number | symbol]: ISerializableTypes
}