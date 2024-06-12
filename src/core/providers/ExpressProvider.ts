import BaseProvider from "../base/Provider";
import IExpressConfig from "../interfaces/IExpressConfig";
import { App } from "../services/App";
import Express from "../services/Express";

export default class ExpressProvider extends BaseProvider
{
    protected configPath: string = '@config/http/express';
    protected config!: IExpressConfig;

    constructor() {
        super();
        this.init()
    }

    public async register(): Promise<void> 
    {
        this.log('Registering ExpressProvider');

        Express.getInstance(this.config).init();
        
        App.setContainer('express', Express.getInstance())
    }

    public async boot(): Promise<void>
    {
        this.log('Booting ExpressProvider');
    }
}