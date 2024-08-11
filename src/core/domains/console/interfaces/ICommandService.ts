import { ICommandReader } from "@src/core/domains/console/interfaces/ICommandReader";
import { ICommandRegister } from "@src/core/domains/console/interfaces/ICommandRegister";

export default interface ICommandService {
    reader: (argv: string[]) => ICommandReader;
    register: () => ICommandRegister;
}