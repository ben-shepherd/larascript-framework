import { IAppConfig } from "@src/config/app.config";

export interface IAppService {
    getConfig(): IAppConfig;
    boot(): Promise<void>;
}