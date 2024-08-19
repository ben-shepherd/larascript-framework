import { ObjectId } from "mongodb";

export default interface IModelData {
    _id?: ObjectId
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}