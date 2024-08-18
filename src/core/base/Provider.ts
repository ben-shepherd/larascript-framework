
import { IProvider } from '@src/core/interfaces/IProvider';

export default abstract class BaseProvider implements IProvider {

    protected providerName: string | null = null;
    protected config: any = {};

    abstract register(): Promise<void>;
    abstract boot(): Promise<void>;

    protected log(message: string, ...args: any[]): void {
        const str = `[Provider] ${message}`;
        if(args.length > 0) {
            console.log(str, ...args);
            return;
        }
        console.log(`[Provider] ${message}`);
    }

    public getProviderName(): string | null {
        return this.providerName;
    }
}