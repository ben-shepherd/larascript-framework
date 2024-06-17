import { EnvironmentType } from "../consts/Environment";
import { ICommandConstructor } from "../domains/console/interfaces/ICommand";
import { IProvider } from "./IProvider";

export default interface IAppConfig {
    environment: EnvironmentType
    providers: IProvider[]
    commands: ICommandConstructor[]
}