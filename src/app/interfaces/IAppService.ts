import { IAppConfig } from "@src/config/app";

export interface IAppService {
    getConfig(): IAppConfig;
    boot(): Promise<void>;
}