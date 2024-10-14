import EventListener from "@src/core/domains/events/services/EventListener";
import { App } from "@src/core/services/App";
import { TestMovieModel } from "@src/tests/models/models/TestMovie";
 
export class TestQueueListener extends EventListener<{name: string}> {
    
    handle = async (payload: {name: string}) => {
        App.container('logger').info('[TestQueueListener]', { name: payload })

        const movie = new TestMovieModel({
            name: payload.name
        });
        await movie.save();
    }

}