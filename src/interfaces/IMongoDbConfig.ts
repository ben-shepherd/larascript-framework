import { MongoClientOptions } from "mongodb";

export default interface {
    uri: string,
    options: MongoClientOptions
}