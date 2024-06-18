import { ICommandReader } from "./ICommandReader";
import { ICommandRegister } from "./ICommandRegister";

export default interface ICommandService {
    reader: (argv: string[]) => ICommandReader;
    register: () => ICommandRegister;
}