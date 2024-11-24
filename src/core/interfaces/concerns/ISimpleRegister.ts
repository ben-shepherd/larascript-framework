/* eslint-disable no-unused-vars */
export interface ISimpleRegister {

    /**
     * Creates a new list with the given name and value.
     * If the list already exists, it will be overwritten.
     * @param {string} listName - The name of the list to create.
     * @param {TListValue} [listValue=new Map()] - The value of the list.
     * @returns {void}
     */
    srCreateList(listName: string, listValue?: IOptionTypes['listValue']): void;

    /**
     * Checks if a list with the given name exists.
     * @param {string} listName - The name of the list to check for existence.
     * @returns {boolean} True if the list exists, false otherwise.
     */
    srListExists(listName: string): boolean;

    /**
     * Updates the list with the given name and value.
     * If the list does not exist, it will be created.
     * @param {string} listName - The name of the list to update.
     * @param {TListValue} listValue - The value of the list.
     * @returns {void}
     */
    srUpdateList(listName: string, listValue: IOptionTypes['listValue']): void;

    /**
     * Retrieves the list with the given name.
     * If the list does not exist, an empty list will be returned.
     * @param {string} listName - The name of the list to retrieve.
     * @returns {TListValue} The retrieved list.
     */
    srGetList(listName: string): IOptionTypes['listValue'];

    /**
     * Clears the list with the given name.
     * If the list does not exist, an empty list will be created.
     * @param {string} listName - The name of the list to clear.
     * @returns {void}
     */
    srClearList(listName: string): void;

    /**
     * Deletes the list with the given name.
     * If the list does not exist, this does nothing.
     * @param {string} listName - The name of the list to delete.
     * @returns {void}
     */
    srDeleteList(listName: string): void;

    /**
     * Sets a value in the list with the given name.
     * If the list does not exist, it will be created.
     * @param {string} key - The key to set the value under.
     * @param {unknown} value - The value to set.
     * @param {string} listName - The name of the list to set the value in.
     * @returns {void}
     */
    srSetValue(key: string, value: unknown, listName: string): void;

    /**
     * Checks if a value is associated with the given key in the specified list.
     * 
     * @param {string} key - The key to check for the associated value.
     * @param {string} listName - The name of the list to check for the key-value association.
     * @returns {boolean} True if the key has an associated value in the list, false otherwise.
     */
    srHasValue(key: string, listName: string): boolean;

    /**
     * Retrieves the value associated with the given key from the specified list.
     * If the key does not exist in the list, returns undefined.
     * @param {string} key - The key of the value to retrieve.
     * @param {string} listName - The name of the list to retrieve the value from.
     * @returns {unknown} The value associated with the key, or undefined if the key is not found.
     */
    srGetValue(key: string, listName: string): unknown;

    /**
     * Execute a simple register command
     * @param command The command to execute
     * @param options The options for the command
     * @returns The return value of the command
     */
    srCommand<K extends keyof ICommandOptionArguement = keyof ICommandOptionArguement>(
        command: K,
        options?: ICommandOptionArguement[K]['options']
    ): ICommandOptionArguement[K]['returns'];
}

/**
 * Storage all lists
 */
export type TSimpleRegisterDatabaseMap = Map<string, TListValueMap>

/**
 * Optional list name
 */
export interface TOptionalListName  { 
    listName?: IOptionTypes['listName']

}

/**
 * Single list value
 */
export type TListValueMap<K = string, T = unknown> = Map<K, T>;

/**
 * Simple register option types
 */
export interface IOptionTypes {
    listName: string,
    listValue: Map<string, unknown>,
    key: string,
    value: unknown
}

/**
 * Base structure for command options
 */
export interface ICommandOptionArguementStructure {
    [key: string]: {
        options: unknown,
        returns?: unknown
    }
}

/**
 * Explcitly defined command options
 */
export interface ICommandOptionArguement extends ICommandOptionArguementStructure {
    createList: {
        options: TOptionalListName & Pick<IOptionTypes, "listValue">
    };
    listExists: {
        options: TOptionalListName,
        returns: boolean
    };
    updateList: {
        options: TOptionalListName & Pick<IOptionTypes, "listValue">
    };
    getList: {
        options: TOptionalListName
        returns: TListValueMap
    };
    clearList: {
        options: TOptionalListName
    };
    deleteList: {
        options: TOptionalListName,
        returns: undefined
    };
    setValue: {
        options: TOptionalListName & Pick<IOptionTypes, "key" | "value">,
    };
    hasValue: {
        options: TOptionalListName & Pick<IOptionTypes, "key">,
        returns: boolean        
    };
    getValue: {
        options: TOptionalListName & Pick<IOptionTypes, "key">,
        returns: unknown
    };
}