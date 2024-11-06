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
        
        /**
         * Registers a key-value pair in the default list.
         * If the default list does not exist, it initializes it as a new Map.
         * 
         * @param {string} key - The key to register the value under.
         * @param {...unknown[]} args - The values to be associated with the key.
         * @returns {void}
         */
        register(key: string, ...args: unknown[]): void {
            if(!this.registerObject[HasRegisterable.defaultList]) {
                this.registerObject[HasRegisterable.defaultList] = new Map();
            }

            this.registerObject[HasRegisterable.defaultList].set(key, args);
        }

        /**
         * Registers a key-value pair in the list with the given name.
         * If the list does not exist, it initializes it as a new Map.
         * 
         * @param {string} listName - The name of the list to register the value in.
         * @param {string} key - The key to register the value under.
         * @param {...unknown[]} args - The values to be associated with the key.
         * @returns {void}
         */
        registerByList(listName: string, key: string, ...args: unknown[]): void {
            this.registerObject[listName] = this.registerObject[listName] ?? new Map();
            this.registerObject[listName].set(key, args);
        }
    
        /**
         * Sets the registered values for the given list name.
         * If the list does not exist, it initializes it as a new Map.
         * @param {string} listName - The name of the list to set the values for.
         * @param {Map<string, unknown>} registered - The values to be associated with the list.
         * @returns {void}
         */
        setRegisteredByList(listName: string, registered: Map<string, unknown>): void {
            this.registerObject[listName] = registered
        }

        /**
         * Retrieves the entire register object containing all registered lists and their key-value pairs.
         * 
         * @returns {IRegsiterList} The complete register object.
         */
        getRegisteredObject(): IRegsiterList {
            return this.registerObject;
        }

        /**
         * Retrieves the registered values from the default list.
         * 
         * @returns {TRegisterMap} A map of key-value pairs from the default list.
         */
        getRegisteredList<T extends TRegisterMap = TRegisterMap>(): T {
            return this.getRegisteredByList(HasRegisterable.defaultList)
        }

        /**
         * Retrieves the registered values for a specific list.
         * If the list does not exist, returns an empty map.
         * 
         * @template T Type of the register map.
         * @param {string} listName - The name of the list to retrieve values from.
         * @returns {T} A map of key-value pairs associated with the specified list.
         */
        getRegisteredByList<T extends TRegisterMap = TRegisterMap>(listName: string): T {
            return this.registerObject[listName] as T ?? new Map();
        }
    
    }
}

export default HasRegisterableConcern