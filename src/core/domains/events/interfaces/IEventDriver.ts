 
import IDispatchable from "@src/core/domains/events-legacy/interfaces/IDispatchable";
import { INameable } from "@src/core/domains/events/interfaces/INameable";

export default interface IEventDriver extends INameable, IDispatchable {}