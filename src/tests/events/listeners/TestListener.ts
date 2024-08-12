import EventListener from "@src/core/domains/events/services/EventListener";
 
export class TestListener extends EventListener<any> {
    
    handle = async (payload: any) => {
        console.log('[TestListener]', payload)
    }
}