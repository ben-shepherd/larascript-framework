export default class QueryFiltersException extends Error {

    constructor(message: string = 'Query Filters Exception') {
        super(message);
        this.name = 'QueryFiltersException';
    }

}