import { IApiResponse, TApiResponse } from "../interfaces/IApiResponse";
import { TPagination } from "../interfaces/Pagination.t";

/**
 * ApiResponse is a class that builds standardized HTTP API responses.
 * It provides a structured way to format response data with:
 * 
 * - Main data payload
 * - Metadata including pagination info and counts
 * - HTTP status code
 * - Additional custom metadata
 *
 * The class uses generics to type the data payload and metadata,
 * and provides a fluent interface for building responses.
 * 
 * Example usage:
 * ```
 * const response = new ApiResponse()
 *   .setData(users)
 *   .addPagination(1, 10)
 *   .addTotalCount()
 *   .build();
 * ```
 */
class ApiResponse<Data = unknown> implements IApiResponse<Data> {

    protected code: number = 200;

    protected data: Data = {} as Data;

    protected pagination?: TPagination;
    
    protected totalCount?: number;

    protected meta: Record<string, unknown> = {}

    protected additionalMeta: Record<string, unknown> = {}

    /**
     * Builds and returns the final response object with all added data and metadata

     * @returns {TResponse} The formatted response object
     */
    build(): TApiResponse<Data> {

        // Reset the meta object
        this.meta = {}

        const response: TApiResponse<Data> = {
            meta: {} as Record<string, unknown>,
            data: this.data
        }

        response.meta = {
            ...this.meta,
            ...this.additionalMeta
        }

        if(this.pagination) {
            response.meta.pagination = this.pagination;
        }

        if(this.totalCount) {
            response.meta.totalCount = this.totalCount;
        }

        return response;
    }

    /**
     * Sets the main data payload of the response
     * @param data - The data to be included in the response
     */
    setData(data: Data): this {
        this.data = data;
        return this;
    }


    /**
     * Returns the main data payload of the response
     * @returns {unknown} The data payload
     */
    getData(): Data {
        return this.data;
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
     * Returns the total count of the response
     * @returns {number} The total count
     */
    getTotalCount(): number | undefined {
        return this.totalCount;
    }



    /**
     * Manually sets the total count in the response metadata

     * @param totalCount - The total count to set
     */
    setTotalCount(totalCount: number) {
        this.totalCount = totalCount;
        return this;
    }

    /**
     * Manually sets the HTTP status code for the response
     * @param code - The HTTP status code to set
     */
    setCode(code: number) {
        this.code = code;
        return this;
    }

    getCode(): number {
        return this.code;
    }

    /**
     * Manually sets the additional metadata for the response

     * @param additionalMeta - The additional metadata to set
     */
    setAdditionalMeta(additionalMeta: Record<string, unknown>) {
        this.additionalMeta = additionalMeta;
        return this;
    }

    /**
     * Returns the additional metadata for the response
     * @returns {Record<string, unknown> | undefined} The additional metadata
     */
    getAdditionalMeta(): Record<string, unknown> {
        return this.additionalMeta;
    }

}



export default ApiResponse;
