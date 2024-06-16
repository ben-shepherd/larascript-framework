import EventListener from "@src/core/domains/events/services/EventListener";
 
export class ExampleListener extends EventListener<{userId: string}> {

    handle = async (payload: { userId: string}) => {
        console.log('[ExampleListener]', payload.userId, payload.userId === '666da65fe9e83efba0f9ab89' ? 'will throw' : 'ok')

        if(payload.userId === '666da65fe9e83efba0f9ab89') {
            throw new Error('something went wrong!')
        }
    }
}