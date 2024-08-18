import { ObjectId } from "mongodb";

export default interface IData {
    _id?: ObjectId
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}