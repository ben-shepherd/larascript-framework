import { IHasRegisterableConcern, IRegsiterList, TRegisterMap } from "@src/core/interfaces/concerns/IHasRegisterableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";

/**
 * Concern that allows a class to register arbitrary values by key.
 * This allows for decoupling of the registration of values from the class itself.
 * The registered values can then be retrieved by key.
 * 
 * If a list name is provided, the registered values are stored in a map with that name.
 * If not, the default list 'default' is used.
 * The registered values can then be retrieved by list name.
 * 
 * @example
 * class MyClass extends HasRegisterableConcern(MyBaseClass) {
 *     constructor() {
 *         super();
 *         this.register('myKey', 'myValue');
 *     }
 * }
 * const myInstance = new MyClass();
 * myInstance.getRegisteredObject()['default'].get('myKey'); // returns 'myValue'
 * 
 * @param {ICtor} Broadcaster The base class to extend.
 * @returns {ICtor} The class that extends the passed in class.
 */
const HasRegisterableConcern = (Broadcaster: ICtor) => {
    return class HasRegisterable extends Broadcaster implements IHasRegisterableConcern {
        
        protected registerObject: IRegsiterList = {}

        private static defaultList = 'default';
        
        register(key: string, ...args: unknown[]): void {
            if(!this.registerObject[HasRegisterable.defaultList]) {
                this.registerObject[HasRegisterable.defaultList] = new Map();
            }

            this.registerObject[HasRegisterable.defaultList].set(key, args);
        }

        registerByList(listName: string, key: string, ...args: unknown[]): void {
            this.registerObject[listName] = this.registerObject[listName] ?? new Map();
            this.registerObject[listName].set(key, args);
        }
    
        setRegisteredByList(listName: string, registered: Map<string, unknown>): void {
            this.registerObject[listName] = registered
        }

        getRegisteredObject(): IRegsiterList {
            return this.registerObject;
        }

        getRegisteredList<T extends TRegisterMap = TRegisterMap>(): T {
            return this.getRegisteredByList(HasRegisterable.defaultList)
        }

        getRegisteredByList<T extends TRegisterMap = TRegisterMap>(listName: string): T {
            return this.registerObject[listName] as T ?? new Map();
        }
    
    }
}

export default HasRegisterableConcern