import { AuthAdapterConstructor } from "../adapter/IAuthAdapter";

export interface IBaseAuthConfig {
    name: string;
    adapter: AuthAdapterConstructor
}
