import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import { IProvider } from '../interfaces/IProvider';

export default abstract class Provider implements IProvider {
    protected config: any = {};
    protected configPath: string | null = null;

    abstract register(): Promise<void>;
    abstract boot(): Promise<void>;

    protected init(): void {
        try {
            dotenv.config()
            
            if(!this.configPath) return;

            // Ensure config file ends in .ts
            const parsedConfigPath = this.configPath?.replace(/\.?(js|ts)?$/, '.ts');

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
        console.log(`[Provider] ${message}`, args);
    }
}