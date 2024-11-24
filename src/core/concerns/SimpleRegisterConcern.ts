import { ICtor } from "../interfaces/ICtor";

export type TListName = string
export type TListValue<T = unknown> = Map<string, T>;

export type TKey = string
export type TValue<T = unknown> = T;

export type TListMap = Map<TListName, TListValue>


const SimpleRegisterConcern = (Base: ICtor) => {
    return class SimpleRegister extends Base {

        static DEFAULT_LIST = 'defaultList';

        protected listMapRegistry: TListMap = new Map();

        createDefaultListRegister() {
            this.createListRegister(SimpleRegister.DEFAULT_LIST);
        }

        getDefaultListRegister(): TListValue | undefined {
            return this.getListRegister(SimpleRegister.DEFAULT_LIST);
        }
        
        updateDefaultListRegister(lisvalue: TListValue) {
            this.updateListRegister(SimpleRegister.DEFAULT_LIST, lisvalue);
        }

        deleteDefaultListRegister() {
            this.deleteListRegister(SimpleRegister.DEFAULT_LIST);
        }

        createListRegister(listName: TListName = SimpleRegister.DEFAULT_LIST) {
            if(!this.listMapRegistry.has(listName)) {
                this.listMapRegistry.set(listName, new Map());
            }
        }

        getListRegister(listName: TListName = SimpleRegister.DEFAULT_LIST): TListValue | undefined {
            return this.listMapRegistry.get(listName);
        }

        updateListRegister(listName: TListName, listValue: TListValue) {
            const currentList = this.getListRegister(listName);

            if(!currentList) {
                this.createListRegister(listName);
            }

            this.listMapRegistry.set(listName, listValue);
        }

        deleteListRegister(listName: TListName) {
            if(this.listMapRegistry.has(listName)) {
                this.listMapRegistry.delete(listName);
            }
        }

        setValueInListRegister(list: string, key: string, value: unknown) {

        }

        getValueInListRegister(list: string, key: string) {
            
        }

    }
}

export default SimpleRegisterConcern