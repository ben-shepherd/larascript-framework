import { Request } from "express";
import IAuthorizedRequest from "@src/core/domains/auth/interfaces/IAuthorizedRequest";
import IValidatorRequest from "@src/core/domains/express/interfaces/IValidatorRequest";

export type BaseRequest = Request & IAuthorizedRequest & IValidatorRequest;