/* eslint-disable no-unused-vars */
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";

export interface IRequestContextData extends Map<string, Map<string, unknown>> {}

export type IPDatesArrayTTL<T = unknown> = { value: T; ttlSeconds: number | null };

export type IPContextData<T = unknown> = Map<string, Map<string, IPDatesArrayTTL<T>>>;

export interface IRequestContext {
  setByRequest<T = unknown>(req: BaseRequest, key: string, value: T): this;
  getByRequest<T = unknown>(req: BaseRequest, key?: string): T | undefined;
  setByIpAddress<T = unknown>(req: BaseRequest, key: string, value: T, ttlSeconds?: number): this;
  getByIpAddress<T = unknown>(req: BaseRequest, key?: string): T | undefined;
  endRequestContext(req: BaseRequest): void;
  getRequestContext(): IRequestContextData;
  setRequestContext(context: IRequestContextData): this;
  getIpContext(): IPContextData;
  setIpContext(context: IPContextData): this;
}