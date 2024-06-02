import { ObjectId } from "mongodb";

export default interface IData {
    id?: ObjectId | null;
    [key: string]: any;
}