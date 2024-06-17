import CommandRegister from "../CommandRegister";

export default interface ICommandService {
    register: () => CommandRegister
}