import { ObjectId } from "mongodb";

export default interface IData {
    _id?: ObjectId | undefined;
    [key: string]: any;
}