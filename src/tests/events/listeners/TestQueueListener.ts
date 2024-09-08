import EventListener from "@src/core/domains/events/services/EventListener";
import { TestMovieModel } from "@src/tests/models/models/TestMovie";
 
export class TestQueueListener extends EventListener<{name: string}> {
    
    handle = async (payload: {name: string}) => {
        console.log('[TestQueueListener]', { name: payload })

        const movie = new TestMovieModel({
            name: payload.name
        });
        await movie.save();
    }

}