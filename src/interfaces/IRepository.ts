import IData from "./IData"

export interface IRepository {
    findById: (id: string) => Promise<IData | null>
    find: (query: object) => Promise<IData | null>
    findMany(query: object): Promise<IData[]>
}