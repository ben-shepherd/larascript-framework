import express from "express";

export default interface IExpressConfig {
    port: number,
    globalMiddlewares?: express.RequestHandler[]
}