/* eslint-disable no-unused-vars */
import { IEventListener } from "@src/core/domains/events-legacy/interfaces/IEventListener";
import { IEventPayload } from "@src/core/domains/events-legacy/interfaces/IEventPayload";

export default abstract class EventListener<
    Payload extends IEventPayload = IEventPayload
> implements IEventListener {

    handle!: (payload: Payload) => any;

}