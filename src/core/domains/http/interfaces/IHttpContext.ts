/* eslint-disable no-unused-vars */
import { IApiTokenModel } from '@src/core/domains/auth/interfaces/models/IApiTokenModel';
import { IUserModel } from '@src/core/domains/auth/interfaces/models/IUserModel';
import { TBaseRequest } from '@src/core/domains/http/interfaces/BaseRequest';
import { TRouteItem } from '@src/core/domains/http/interfaces/IRouter';
import { NextFunction, Response } from 'express';

import { IStorageFile } from '../../storage/interfaces/IStorageFile';
import { TUploadedFile } from './UploadedFile';

export interface IHttpContext {
    getRouteItem(): TRouteItem | undefined;
    getUser(): IUserModel | undefined;
    getApiToken(): IApiTokenModel | undefined;
    getMethod(): string;
    getParams(): Record<string, string>;
    getParam(key: string): string | undefined;
    getQueryParam(key: string): string | undefined;
    getQueryParams(): Record<string, string>;
    getBody(): Record<string, string>;
    getByRequest<T = unknown>(key: string): T | undefined;
    setContext(key: string, value: unknown): void;
    getIpContext<T = unknown>(key: string): T | undefined;
    setIpContext(key: string, value: unknown, ttl?: number): void;
    getId(): string;
    getRequest(): TBaseRequest;
    getResponse(): Response;
    getNext(): NextFunction | undefined;
    getFile(key: string): TUploadedFile | undefined;
    getFiles(key: string): TUploadedFile[] | undefined;
    uploadFile(file: TUploadedFile): Promise<IStorageFile>;
}

export interface IHasHttpContext {
    setHttpContext(context: IHttpContext): void;
    getHttpContext(): IHttpContext;
}