import IAuthorizedRequest from "@src/core/domains/auth/interfaces/IAuthorizedRequest";
import IValidatorRequest from "@src/core/domains/express/interfaces/IValidatorRequest";
import { Request } from "express";

import IRequestIdentifiable from "../../auth/interfaces/IRequestIdentifiable";
import ISecurityRequest from "../interfaces/ISecurityRequest";

/**
 * Extends the express Request object with auth and validator properties.
 */
export type BaseRequest = Request & IAuthorizedRequest & IValidatorRequest & ISecurityRequest & IRequestIdentifiable;