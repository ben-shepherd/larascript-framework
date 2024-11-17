/* eslint-disable no-unused-vars */
import HasRegisterableConcern from "@src/core/concerns/HasRegisterableConcern";
import { IHasRegisterableConcern, IRegsiterList, TRegisterMap } from "@src/core/interfaces/concerns/IHasRegisterableConcern";
import compose from "@src/core/util/compose";

export default class BaseRegister extends compose(class {}, HasRegisterableConcern) implements IHasRegisterableConcern {

    declare register: (key: string, value: unknown) => void;

    declare registerByList: (listName: string, key: string, value: unknown) => void;

    declare setRegisteredByList: (listName: string, registered: TRegisterMap) => void;

    declare getRegisteredByList: <T extends TRegisterMap = TRegisterMap>(listName: string) => T;

    declare getRegisteredList: <T extends TRegisterMap = TRegisterMap>() => T;

    declare getRegisteredObject: () => IRegsiterList;

    declare isRegisteredInList: (listName: string, key: string) => boolean;

    declare findInRegisteredList: <T>(list: string, key: string) => T | undefined;

    declare registerApppendByList: (listName: string, key: string, ...args: unknown[]) => void

}