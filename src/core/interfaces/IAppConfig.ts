import { EnvironmentType } from "../consts/Environment";
import { ICommandConstructor } from "../domains/Console/interfaces/ICommand";
import { IProvider } from "./IProvider";

export default interface IAppConfig {
    environment: EnvironmentType
    providers: IProvider[]
    commands: ICommandConstructor[]
}