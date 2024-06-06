import Express from "../services/Express";
import Provider from "../base/Provider";
import Kernel from "../kernel";
import RoutesProvider from "./RoutesProvider";
import ExpressProvider from "./ExpressProvider";

export default class ExpressListenerProvider extends Provider
{
    public async register(): Promise<void> 
    {
        this.log('Registering ExpressListenerProvider');
    }

    public async boot(): Promise<void>
    {
        if(!Kernel.isProviderReady(ExpressProvider.name)) {
            throw new Error('ExpressProvider must be loaded before ExpressListenerProvider');
        }

        if(!Kernel.isProviderReady(RoutesProvider.name)) {
            throw new Error('RoutesProvider must be loaded before ExpressListenerProvider');
        }

        this.log('Booting ExpressListenerProvider');

        await Express.getInstance().listen();

        this.log('Express successfully listening on port ' + Express.getInstance().getConfig()?.port);
    }
}