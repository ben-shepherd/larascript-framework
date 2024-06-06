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
        this.log('Booting ExpressListenerProvider');

        if(!Kernel.isReady(ExpressProvider.name)) {
            throw new Error('ExpressProvider must be loaded before ExpressListenerProvider');
        }

        if(!Kernel.isReady(RoutesProvider.name)) {
            throw new Error('RoutesProvider must be loaded before ExpressListenerProvider');
        }

        await Express.getInstance().listen();

        this.log('Express successfully listening on port ' + Express.getInstance().getConfig()?.port);
    }
}