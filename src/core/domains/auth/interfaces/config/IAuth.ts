import { AuthAdapterConstructor } from "@src/core/domains/auth/interfaces/adapter/IAuthAdapter";

export interface IBaseAuthConfig {
    name: string;
    adapter: AuthAdapterConstructor
}
