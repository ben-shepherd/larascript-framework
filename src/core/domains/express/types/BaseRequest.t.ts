import { Request } from "express";
import IAuthorizedRequest from "../../auth/interfaces/IAuthorizedRequest";
import IValidatorRequest from "../interfaces/IValidatorRequest";

export type BaseRequest = Request & IAuthorizedRequest & IValidatorRequest;