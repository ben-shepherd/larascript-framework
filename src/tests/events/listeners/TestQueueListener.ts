import EventListener from "@src/core/domains/events/services/EventListener";
import { MovieModel } from "@src/tests/models/models/Movie";
 
export class TestQueueListener extends EventListener<{name: string}> {
    
    handle = async ({name}: {name: string}) => {
        console.log('[TestQueueListener]', { name })

        const movie = new MovieModel({
            name
        });
        await movie.save();
    }
}