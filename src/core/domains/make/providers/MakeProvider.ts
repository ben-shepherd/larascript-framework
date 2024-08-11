import BaseProvider from "@src/core/base/Provider";
import MakeCmdCommand from "@src/core/domains/Make/commands/MakeCmdCommand";
import MakeListenerCommand from "@src/core/domains/Make/commands/MakeListenerCommand";
import MakeModelCommand from "@src/core/domains/Make/commands/MakeModelCommand";
import MakeObserverCommand from "@src/core/domains/Make/commands/MakeObserverCommand";
import MakeProviderCommand from "@src/core/domains/Make/commands/MakeProviderCommand";
import MakeRepositoryCommand from "@src/core/domains/Make/commands/MakeRepositoryCommand";
import MakeServiceCommand from "@src/core/domains/Make/commands/MakeServiceCommand";
import MakeSingletonCommand from "@src/core/domains/Make/commands/MakeSingletonCommand";
import MakeSubscriberCommand from "@src/core/domains/Make/commands/MakeSubscriberCommand";
import { App } from "@src/core/services/App";

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
            MakeSubscriberCommand,
            MakeProviderCommand
        ])
    }

    async boot(): Promise<void> 
    {
        console.log('Booting MakeProvider')    
    }
}
