import { IEventListener } from "../interfaces/events/IEventListener";

export default class EventListener implements IEventListener {
 
    public handle() {
        console.log('[EventListner] 123')
    }
}