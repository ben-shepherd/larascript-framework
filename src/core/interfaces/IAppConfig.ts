import { EnvironmentType } from "@src/core/consts/Environment";
import { IProvider } from "@src/core/interfaces/IProvider";

export default interface IAppConfig {
    environment: EnvironmentType
    providers: IProvider[]
}