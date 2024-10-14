import EventListener from "@src/core/domains/events/services/EventListener";
import { App } from "@src/core/services/App";
 
export class TestListener extends EventListener<any> {
    
    handle = async (payload: any) => {
        App.container('logger').info('[TestListener]', payload)
    }

}