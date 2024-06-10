import BaseProvider from "../../core/base/Provider";
import { IAuthConfig } from "../../core/interfaces/IAuthConfig";

export default class ExampleProvider extends BaseProvider
{
    protected config!: IAuthConfig;
    configPath = '@config/example/fileName';

    constructor() {
        super()
        this.init()
    }

    public async register(): Promise<void> {
        this.log('Registering ExampleProvider');
    }

    public async boot(): Promise<void> {
        this.log('Booting ExampleProvider');
    }
}