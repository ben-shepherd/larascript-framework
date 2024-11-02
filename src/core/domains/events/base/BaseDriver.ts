/* eslint-disable no-unused-vars */
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";

abstract class BaseDriver implements IEventDriver {

    protected eventService!: IEventService;

    constructor(eventService: IEventService) {
        this.eventService = eventService
    }

    abstract dispatch(event: IBaseEvent): Promise<void>;

    abstract getName(): string;

}

export default BaseDriver