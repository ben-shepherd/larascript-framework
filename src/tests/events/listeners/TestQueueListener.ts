import EventListener from "@src/core/domains/events/services/EventListener";
import { TestMovieModel } from "@src/tests/models/models/TestMovie";
 
export class TestQueueListener extends EventListener<{name: string}> {
    
    handle = async ({name}: {name: string}) => {
        console.log('[TestQueueListener]', { name })

        const movie = new TestMovieModel({
            name
        });
        await movie.save();
    }
}