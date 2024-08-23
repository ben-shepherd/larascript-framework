import ICommandBootService from "@src/core/domains/console/interfaces/ICommandBootService";
import { KernelOptions } from "@src/core/Kernel";
import { App } from "@src/core/services/App";

class CommandBootService implements ICommandBootService
{
    /**
     * Execute commands
     * @param args 
     * @throws CommandNotFoundException
     */
    async boot(args: string[]): Promise<void> {
        await App.container('console').reader(args).handle()
    }

    /**
     * Get the kernel options
     * If a command is detected, we will exclude Express and Routes from being loaded. 
     * @param args 
     * @param options 
     * @returns 
     */
    getKernelOptions = (args: string[], options: KernelOptions): KernelOptions => 
    {
        options.withoutProvider = [...(options.withoutProvider ?? [])];

        if(args.length) {
            options.withoutProvider = ['ExpressProvider', 'RoutesProvider']
        }

        if(args.includes('--no-auth')) {
            options.withoutProvider?.push('AuthProvider');
        }
        if(args.includes('--no-db')) {
            options.withoutProvider?.push('MongoDBProvider');
        }

        return options
    }


}

export default CommandBootService;