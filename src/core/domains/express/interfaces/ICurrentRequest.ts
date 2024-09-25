/* eslint-disable no-unused-vars */
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";

export interface ICurrentRequest {
  setByRequest(req: BaseRequest, key: string, value: unknown): this;
  getByRequest<T = unknown>(req: BaseRequest, key?: string): T | undefined;
  setByIpAddress(req: BaseRequest, key: string, value: unknown): this;
  getByIpAddress<T = unknown>(req: BaseRequest, key?: string): T | undefined;
  endRequest(req: BaseRequest): void;
  getContext(): Record<string, Record<string, unknown>>;
}