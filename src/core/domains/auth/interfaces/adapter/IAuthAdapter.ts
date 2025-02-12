/* eslint-disable no-unused-vars */
import { IAclConfig } from "@src/core/domains/auth/interfaces/acl/IAclConfig";
import { IBaseAuthConfig } from "@src/core/domains/auth/interfaces/config/IAuth";
import { IRouter } from "@src/core/domains/http/interfaces/IRouter";

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




