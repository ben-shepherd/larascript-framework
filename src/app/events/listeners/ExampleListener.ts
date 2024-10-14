import EventListener from "@src/core/domains/events/services/EventListener";
 
export class ExampleListener extends EventListener<{userId: string}> {
    
    // eslint-disable-next-line no-unused-vars
    handle = async (payload: { userId: string}) => {
        // Handle the logic
    }

}