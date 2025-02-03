
type TPagination = {
    total?: number;
    page?: number;
    pageSize?: number;
    nextPage?: number;
    previousPage?: number;
}

type TResponse = {
    meta: {
        [key: string]: unknown;
    }
    data: unknown;
}

/**
 * ApiResponse class provides a standardized way to build HTTP API responses
 * with support for data, pagination, and additional metadata.
 * 
 * The response format follows the structure:
 * {
 *   meta: {
 *     pagination?: { total, page, pageSize, nextPage, previousPage },
 *     totalCount?: number,
 *     ...additionalMeta
 *   },
 *   data: unknown
 * }
 */
class ApiResponseBuilder {

    protected data: unknown;

    protected pagination?: TPagination;
    
    protected totalCount?: number;

    protected additionalMeta?: Record<string, unknown>;

    /**
     * Builds and returns the final response object with all added data and metadata
     * @returns {TResponse} The formatted response object
     */
    build(): TResponse {
        const response: TResponse = {

            meta: {},
            data: this.data
        }

        if(this.pagination) {
            response.meta.pagination = this.pagination;
        }

        if(this.totalCount) {
            response.meta.totalCount = this.totalCount;
        }

        response.meta = {
            ...response.meta,
            ...this.additionalMeta
        }

        return response;
    }

    /**
     * Sets the main data payload of the response
     * @param data - The data to be included in the response
     */
    addData(data: unknown): this {
        this.data = data;
        return this;
    }


    /**
     * Adds pagination information to the response metadata
     * @param pagination - Object containing pagination details
     */
    addPagination(page: number, pageSize?: number): this {
        this.pagination = {
            page,
            pageSize,
            nextPage: page + 1,
            previousPage: page - 1
        }
        return this;

    }

    /**
     * Automatically calculates and sets the total count based on the data
     * if the data is an array. If data is not an array, totalCount will be undefined.
     */
    addTotalCount(): this {
        this.totalCount = undefined;

        if(Array.isArray(this.data)) {
            this.totalCount = this.data.length;
        }

        return this;
    }


    /**
     * Manually sets the total count in the response metadata
     * @param totalCount - The total count to set
     */
    setTotalCount(totalCount: number) {
        this.totalCount = totalCount;
        return this;
    }

}



export default ApiResponseBuilder;
