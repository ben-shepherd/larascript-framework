import { EnvironmentType } from "../consts/Environment";
import { IProvider } from "./IProvider";

export default interface IAppConfig {
    environment: EnvironmentType
    providers: IProvider[]
}