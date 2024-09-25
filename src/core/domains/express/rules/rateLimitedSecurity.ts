import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Request } from "express";

import RateLimitedExceededError from "../../auth/exceptions/RateLimitedExceededError";
import CurrentRequest from "../services/CurrentRequest";

/**
 * Handles a new request by adding the current time to the request's hit log.
 *
 * @param {string} id - The id of the request.
 * @param {Request} req - The express request object.
 */
const handleNewRequest = (id: string, req: Request) => {
    CurrentRequest.setByIpAddress(req, id, [
        ...getCurrentDates(id, req),
        new Date()
    ]);
}

/**
 * Reverts the last request hit by removing the latest date from the hit log.
 *
 * @param {string} id - The id of the request.
 * @param {Request} req - The express request object.
 */
const undoNewRequest = (id: string, req: Request) => {
    const dates = [...getCurrentDates(id, req)];
    dates.pop();
    CurrentRequest.setByIpAddress(req, id, dates);
}

/**
 * Gets the current hits as an array of dates for the given request and id.
 *
 * @param id The id of the hits to retrieve.
 * @param req The request object.
 * @returns The array of dates of the hits, or an empty array if not found.
 */
const getCurrentDates = (id: string, req: Request): Date[] => {
    return CurrentRequest.getByIpAddress<Date[]>(req, id) ?? [];
}

/**
 * Finds the number of dates in the given array that are within the given start and end date range.
 * @param start The start date of the range.
 * @param end The end date of the range.
 * @param hits The array of dates to search through.
 * @returns The number of dates in the array that fall within the given range.
 */
const findDatesWithinTimeRange = (start: Date, end: Date, hits: Date[]): number => {
    return hits.filter((hit) => {
        return hit >= start && hit <= end;
    }).length;
}

/**
 * Checks if the current request has exceeded the given rate limit per minute.
 * 
 * @param req The request to check.
 * @param limitPerMinute The maximum number of requests the user can make per minute.
 * @returns true if the request has not exceeded the rate limit, false otherwise.
 * @throws RateLimitedExceededError if the rate limit has been exceeded.
 */
const rateLimitedSecurity = (req: BaseRequest, limit: number, perMinuteAmount: number = 1): boolean => {

    // The identifier is the request method and url
    const identifier = `rateLimited:${req.method}:${req.url}`

    // Handle a new request
    // Stores dates in CurrentRequest linked by the IP address
    handleNewRequest(identifier, req);

    // Get the current date
    const now = new Date();
    
    // Get date in the past
    const dateInPast = new Date();
    dateInPast.setMinutes(dateInPast.getMinutes() - perMinuteAmount);

    // Get current requests as an array of dates
    const requestAttemptsAsDateArray = getCurrentDates(identifier, req);

    // Get the number of requests within the time range
    const requestAttemptCount = findDatesWithinTimeRange(dateInPast, now, requestAttemptsAsDateArray);

    // If the number of requests is greater than the limit, throw an error
    if(requestAttemptCount > limit) {
        // Undo the new request, we won't consider this request as part of the limit
        undoNewRequest(identifier, req);

        // Throw the error
        throw new RateLimitedExceededError()
    }

    // Limits not exceeded
    return true;
}

export default rateLimitedSecurity