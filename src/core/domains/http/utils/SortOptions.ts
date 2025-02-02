import Singleton from "@src/core/base/Singleton";
import { Request } from "express";

export type TSortDirection = 'asc' | 'desc'

export type TSortOptions = {
    fieldKey: string;
    directionKey: string;
    defaultField?: string;
    defaultDirection?: TSortDirection;
}

const DEFAULT_SORT_OPTIONS: TSortOptions = {
    fieldKey: 'sort',
    directionKey: 'direction',
    defaultField: 'createdAt',
    defaultDirection: 'asc'
}

class SortOptions extends Singleton {

    field: string = '';

    sortDirection: TSortDirection = 'asc';

    /**
     * Parses the request object to extract the page and pageSize from the query string
     * 
     * @param {Request} req - The Express Request object
     * @returns {this} - The Paginate class itself to enable chaining
     */
    static parseRequest(req: Request, options: TSortOptions = DEFAULT_SORT_OPTIONS): SortOptions {
       
        const result = new SortOptions();
        const fieldKey = req.query[options.fieldKey] ?? options.defaultField;
        const direction = result.parseDirection(req.query[options.directionKey] as string | undefined, options.defaultDirection);

        result.field = fieldKey as string;
        result.sortDirection = direction as TSortDirection;

        return result;
    }

    /**

     * Parses the sort string to determine the direction
     * 
     * @param {string} rawDirection - The sort string
     * @returns {string} - The direction
     */
    protected parseDirection(rawDirection?: string, defaultDiretion: TSortDirection = 'asc'): TSortDirection {

        if(!rawDirection) {
            return defaultDiretion
        }

        if(rawDirection.startsWith('-')) {
            return 'desc'
        }

        if(rawDirection.toLocaleLowerCase() === 'desc') {
            return 'desc'
        }

        if(!isNaN(Number(rawDirection)) && Number(rawDirection) === -1) {
            return 'desc'
        }

        if(!isNaN(Number(rawDirection)) && Number(rawDirection) === 1) {
            return 'asc'
        }

        return 'asc'

    }

}


export default SortOptions