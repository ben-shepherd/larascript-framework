import IExpressConfig from "../interfaces/IExpressConfig";
import Express from "../services/Express";
import BaseProvider from "./BaseProvider";

export default class ExpressProvider extends BaseProvider
{
    protected configPath: string = 'src/config/http/express';
    protected config!: IExpressConfig;

    constructor() {
        super();
        this.init()
    }

    public async register(): Promise<void> 
    {
        this.log('Registering ExpressProvider', this.config);

        Express.getInstance(this.config).init();
    }

    public async boot(): Promise<void>
    {
        this.log('Booting ExpressProvider');
    }
}