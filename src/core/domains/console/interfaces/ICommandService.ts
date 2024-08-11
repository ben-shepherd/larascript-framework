import { ICommandReader } from "@src/core/domains/Console/interfaces/ICommandReader";
import { ICommandRegister } from "@src/core/domains/Console/interfaces/ICommandRegister";

export default interface ICommandService {
    reader: (argv: string[]) => ICommandReader;
    register: () => ICommandRegister;
}