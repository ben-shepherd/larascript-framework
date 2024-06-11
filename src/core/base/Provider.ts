import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { IProvider } from '../interfaces/IProvider';

export default abstract class BaseProvider implements IProvider {

    protected providerName: string | null = null;
    protected config: any = {};
    protected configPath: string | null = null;

    abstract register(): Promise<void>;
    abstract boot(): Promise<void>;

    protected init(): void {
        try {
            dotenv.config()
            
            if(!this.configPath) return;

            // Ensure config file ends in .ts
            const parsedConfigPath = this.configPath?.replace(/\.?(js|ts)?$/, '.ts')
                .replace('@config', 'src/config');

            const fullPath = path.resolve(parsedConfigPath);
            if (fs.existsSync(fullPath)) {
                const module: { default: any } = require(fullPath);
                this.config = module.default
            } else {
                return;
            }
        } catch (error) {
            if (error instanceof Error) {
                this.log(`Failed to load configuration file at ${this.configPath}: ${error.message}`);
            }
            return;
        }
    }

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