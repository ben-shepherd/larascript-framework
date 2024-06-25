import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";
import MakeCmdCommand from "../commands/MakeCmdCommand";
import MakeListenerCommand from "../commands/MakeListenerCommand";
import MakeModelCommand from "../commands/MakeModelCommand";
import MakeObserverCommand from "../commands/MakeObserverCommand";
import MakeRepositoryCommand from "../commands/MakeRepositoryCommand";
import MakeServiceCommand from "../commands/MakeServiceCommand";
import MakeSingletonCommand from "../commands/MakeSingletonCommand";
import MakeSubscriberCommand from "../commands/MakeSubscriberCommand";

export default class MakeProvider extends BaseProvider
{
    async register(): Promise<void> 
    {
        console.log('Registering MakeProvider')    

        App.container('console').register().registerAll([
            MakeCmdCommand,
            MakeListenerCommand,
            MakeModelCommand,
            MakeObserverCommand,
            MakeRepositoryCommand,
            MakeServiceCommand,
            MakeSingletonCommand,
            MakeSubscriberCommand
        ])
    }

    async boot(): Promise<void> 
    {
        console.log('Booting MakeProvider')    
    }
}
