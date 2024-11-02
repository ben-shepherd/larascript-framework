import { IHasRegisterableConcern, IRegsiterList, TRegisterMap } from "@src/core/interfaces/concerns/IHasRegisterableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";

const HasRegisterableConcern = (Broadcaster: ICtor) => {
    return class HasRegisterable extends Broadcaster implements IHasRegisterableConcern {
        
        protected registerObject: IRegsiterList = {}

        private static defaultList = 'default';

        constructor() {
            super();
            this.registerList = {};
        }
        
        register(key: string, ...args: unknown[]): void {
            if(!this.registerList[HasRegisterable.defaultList]) {
                this.registerList[HasRegisterable.defaultList] = new Map();
            }

            this.registerList[HasRegisterable.defaultList].set(key, args);
        }

        registerByList(listName: string, key: string, ...args: unknown[]): void {
            this.registerObject[listName] = this.registerObject[listName] ?? new Map();
            this.registerObject[listName].set(key, args);
        }
    
        setRegisteredByList(listName: string, registered: Map<string, unknown>): void {
            this.registerList[listName] = registered
        }

        getRegisteredObject(): IRegsiterList {
            return this.registerObject;
        }

        getRegisteredList(): TRegisterMap {
            return this.getRegisteredByList(HasRegisterable.defaultList);
        }

        getRegisteredByList(listName: string): TRegisterMap {
            return this.registerObject[listName] ?? new Map();
        }
    
    }
}

export default HasRegisterableConcern