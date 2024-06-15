import { ExampleListener } from "@src/app/events/listeners/ExampleListener";
import { IEventConfig } from "@src/core/interfaces/IEventConfig";

const eventsConfig: IEventConfig = {
    'OnExample': [
        ExampleListener
    ]   
}

export default eventsConfig;