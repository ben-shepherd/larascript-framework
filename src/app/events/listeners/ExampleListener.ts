import EventListener from "@src/core/events/EventListener";
 
export class ExapleListener extends EventListener {

    handle = async (payload: { userId: string }) => {
        console.log('[ExampleListener]', payload.userId)
    }
}