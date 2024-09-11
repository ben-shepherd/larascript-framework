import IAuthorizedRequest from "@src/core/domains/auth/interfaces/IAuthorizedRequest";
import IValidatorRequest from "@src/core/domains/express/interfaces/IValidatorRequest";
import { Request } from "express";

/**
 * Extends the express Request object with auth and validator properties.
 */
export type BaseRequest = Request & IAuthorizedRequest & IValidatorRequest;