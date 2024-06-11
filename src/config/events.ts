import { LoginListener } from "@src/app/events/listeners/LoginListener";
import { IEventConfig } from "@src/core/interfaces/IEventConfig";

const eventsConfig: IEventConfig = {
    'OnLogin': [
        new LoginListener()
    ]   
}

export default eventsConfig;