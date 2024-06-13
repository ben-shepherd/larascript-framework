import { ExapleListener } from "@src/app/events/listeners/ExampleListener";
import { IEventConfig } from "@src/core/interfaces/IEventConfig";

const eventsConfig: IEventConfig = {
    'OnExample': [
        new ExapleListener()
    ]   
}

export default eventsConfig;