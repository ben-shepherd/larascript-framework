import { EnvironmentType } from "@src/core/consts/Environment";
import { ICommandConstructor } from "@src/core/domains/console/interfaces/ICommand";
import { IProvider } from "@src/core/interfaces/IProvider";

export default interface IAppConfig {
    environment: EnvironmentType
    providers: IProvider[]
    commands: ICommandConstructor[]
}