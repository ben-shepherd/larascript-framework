/* eslint-disable no-unused-vars */
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";

export interface IHasDispatcherConcern {

    dispatch: (event: IBaseEvent) => Promise<void>;
}