import { TListValue } from "../concerns/SimpleRegisterConcern";
import { ICommandOptionArguement, ICommandOptionArguementStructure, ISimpleRegister, TOptionalListName, TSimpleRegisterDatabaseMap } from "../interfaces/concerns/ISimpleRegister";

export const DEFAULT_LIST = 'defaultList';
export const DEFAULT_KEY = 'defaultKey';

const DEFAULTS: ICommandOptionArguementStructure = {
    createList: {
        options: {
            listName: DEFAULT_LIST,
            listValue: new Map()
        }
    },
    listExists: {
        options: {
            listName: DEFAULT_LIST
        }
    },
    getList: {
        options: {
            listName: DEFAULT_LIST
        },
        returns: new Map()
    },
    updateList: {
        options: {
            listName: DEFAULT_LIST,
            listValue: new Map()
        }
    },
    clearList: {
        options: {
            listName: DEFAULT_LIST
        }
    },
    deleteList: {
        options: {
            listName: DEFAULT_LIST
        }
    },
    setValue: {
        options: {
            listName: DEFAULT_LIST,
            key: DEFAULT_KEY,
            value: undefined
        }
    },
    getValue: {
        options: {
            listName: DEFAULT_LIST,
            key: DEFAULT_KEY
        }
    }
}

class SimpleRegister implements ISimpleRegister {

    /**
     * Store all the lists
     */
    protected listMapRegistry: TSimpleRegisterDatabaseMap = new Map();


    /**
     * Creates a new list with the given name and value.
     * If the list already exists, it will be overwritten.
     * @param {string} listName - The name of the list to create.
     * @param {TListValue} [listValue=new Map()] - The value of the list.
     * @returns {void}
     */
    srCreateList(listName: string, listValue: TListValue = new Map()) {
        this.srCommand('createList', { listName, listValue });
    }

    /**
     * Checks if a list with the given name exists.
     * @param {string} listName - The name of the list to check for existence.
     * @returns {boolean} True if the list exists, false otherwise.
     */
    srListExists(listName: string) {
        return this.srCommand('listExists', { listName });
    }

    /**
     * Updates the list with the given name and value.
     * If the list does not exist, it will be created.
     * @param {string} listName - The name of the list to update.
     * @param {TListValue} listValue - The value of the list.
     * @returns {void}
     */
    srUpdateList(listName: string, listValue: TListValue) {
        this.srCommand('updateList', { listName, listValue });
    }

    /**
     * Retrieves the list with the given name.
     * If the list does not exist, an empty list will be returned.
     * @param {string} listName - The name of the list to retrieve.
     * @returns {TListValue} The retrieved list.
     */
    srGetList(listName: string): TListValue {
        return this.srCommand('getList', { listName });
    }

    /**
     * Clears the list with the given name.
     * If the list does not exist, an empty list will be created.
     * 
     * @param {string} listName - The name of the list to clear.
     * @returns {void}
     */
    srClearList(listName: string) {
        this.srCommand('clearList', { listName });
    }

    /**
     * Deletes the list with the given name.
     * If the list does not exist, this does nothing.
     * @param {string} listName - The name of the list to delete.
     * @returns {void}
     */
    srDeleteList(listName: string) {
        this.srCommand('deleteList', { listName });
    }

    /**
     * Sets a value in the list with the given name.
     * If the list does not exist, it will be created.
     * @param {string} key - The key to set the value under.
     * @param {unknown} value - The value to set.
     * @param {string} listName - The name of the list to set the value in.
     * @returns {void}
     */
    srSetValue(key: string, value: unknown, listName: string) {
        this.srCommand('setValue', { key, value, listName });
    }

    /**
     * Checks if a value is associated with the given key in the specified list.
     * @param {string} key - The key to check for the associated value.
     * @param {string} listName - The name of the list to check for the key-value association.
     * @returns {boolean} True if the key has an associated value in the list, false otherwise.
     */
    srHasValue(key: string, listName: string): boolean {
        return this.srCommand('hasValue', { key, listName });
    }

    /**
     * Retrieves the value associated with the given key from the specified list.
     * If the key does not exist in the list, returns undefined.
     * 
     * @param {string} key - The key of the value to retrieve.
     * @param {string} listName - The name of the list to retrieve the value from.
     * @returns {unknown} The value associated with the key, or undefined if the key is not found.
     */
    srGetValue(key: string, listName: string): unknown {
        return this.srCommand('getValue', { key, listName });
    }

    /**
     * Execute a simple register command
     * @param command The command to execute
     * @param options The options for the command
     * @returns The return value of the command
     */
    srCommand<K extends keyof ICommandOptionArguement = keyof ICommandOptionArguement>
    (command: K, options?: ICommandOptionArguement[K]['options']): ICommandOptionArguement[K]['returns'] {

        const listName = (options as TOptionalListName)?.listName ?? DEFAULT_LIST;
        const optionsWithDefaults = { ...(DEFAULTS[command].options as object), ...(options ?? {}) }

        const commandHandlers: Record<keyof ICommandOptionArguement, () => unknown> = {
            createList: () => {
                this.createList(listName);
                this.updateList(listName, (optionsWithDefaults as ICommandOptionArguement['createList']['options']).listValue);                
            },
            listExists: () => {
                return this.listExists(listName);
            },
            getList: () => {
                return this.getList(listName);
            },
            updateList: () => {
                this.updateList(
                    listName,
                    (optionsWithDefaults as ICommandOptionArguement['updateList']['options']).listValue
                )
            },
            clearList: () => {
                this.clearList(listName);
            },
            deleteList: () => {
                this.deleteList(listName);
            },
            setValue: () => {
                this.setValue(
                    (optionsWithDefaults as ICommandOptionArguement['setValue']['options']).key,
                    (optionsWithDefaults as ICommandOptionArguement['setValue']['options']).value,
                    listName
                )
            },
            hasValue: () => {
                return this.hasValue(
                    (optionsWithDefaults as ICommandOptionArguement['hasValue']['options']).key,
                    listName
                )    
            },
            getValue: () => {
                return this.getValue(
                    (optionsWithDefaults as ICommandOptionArguement['getValue']['options']).key,
                    listName
                )
            }
        }

        return commandHandlers[command]() as ICommandOptionArguement[K]['returns']
    }

    protected createList(listName: string) {
        this.listMapRegistry.set(listName, new Map());
    }

    protected listExists(listName: string) {
        return this.listMapRegistry.has(listName);
    }

    protected createListOverwrite(listName: string) {
        this.listMapRegistry.set(listName, new Map());
    }

    protected getList<T extends TListValue = TListValue>(listName: string): T {
        return this.listMapRegistry.get(listName) as T;
    }

    protected updateList(listName: string, listValue?: TListValue) {
        this.listMapRegistry.set(listName, listValue ?? new Map());
    }

    protected clearList(listName: string) {
        this.listMapRegistry.set(listName, new Map());
    }

    protected deleteList(listName: string) {
        if(this.listMapRegistry.has(listName)) {
            this.listMapRegistry.delete(listName);
        }
    }

    protected setValue(key: string, listValue: unknown, listName: string) {
        this.getList(listName)?.set(key, listValue);
    }

    protected hasValue(key: string, listName: string) {
        return this.getList(listName)?.has(key) ?? false;
    }

    protected getValue<T = unknown>(key: string, listName: string): T | undefined{
        return this.getList(listName)?.get(key) as T ?? undefined
    }

}
export default SimpleRegister