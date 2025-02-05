import { ISecurityRequest } from "@src/core/domains/http/interfaces/ISecurity";
import IValidatorRequest from "@src/core/domains/http/interfaces/IValidatorRequest";
import { Request } from "express";

import IAuthorizedRequest from "./IAuthorizedRequest";
import { IRequestIdentifiable } from "./IRequestIdentifable";

/**
 * TBaseRequest combines multiple request interfaces to create a comprehensive request type.
 * It extends Express's Request and includes:
 * - Authorization capabilities (IAuthorizedRequest)
 * - Request validation (IValidatorRequest) 
 * - Security features (ISecurityRequest)
 * - Request identification (IRequestIdentifiable)
 */
export type TBaseRequest = Request & IAuthorizedRequest & IValidatorRequest & ISecurityRequest & IRequestIdentifiable;