import IData from "./IData"

export interface IRepository {
    findById: (id: string) => Promise<IData | null>
    findOne: (query: object) => Promise<IData | null>
    findMany(query: object): Promise<IData[]>
}