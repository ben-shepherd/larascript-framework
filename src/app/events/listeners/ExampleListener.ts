import EventListener from "@src/core/events/EventListener";
 
export class ExampleListener extends EventListener<{userId: string}> {

    handle = (payload: { userId: string}) => {
        console.log('[ExampleListener]', payload)
    }
}