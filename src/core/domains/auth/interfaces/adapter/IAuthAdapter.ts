/* eslint-disable no-unused-vars */
import { IRouter } from "../../../http/interfaces/IRouter";
import { IAclConfig } from "../acl/IAclConfig";
import { IBaseAuthConfig } from "../config/IAuth";

export interface AuthAdapterConstructor<Adapter extends IAuthAdapter = IAuthAdapter> {
    new (config: Adapter['config'], aclConfig: IAclConfig): Adapter;
}

export interface IAuthAdapter<TConfig extends IBaseAuthConfig = IBaseAuthConfig> {
    boot(): Promise<void>;
    config: TConfig;
    getConfig(): TConfig;
    setConfig(config: TConfig): void;
    getRouter(): IRouter;
}




