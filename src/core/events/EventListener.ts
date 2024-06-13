import { IEventListener } from "../interfaces/events/IEventListener";

export default abstract class EventListener implements IEventListener {
    handle!: (payload: any) => any;
}