import { IModel } from "@src/core/interfaces/IModel";
import BaseQueryBuilder from "../../eloquent/base/BaseQueryBuilder";
import { ICollection } from "../../collections/interfaces/ICollection";
import { IQueryBuilder } from "../../eloquent/interfaces/IQueryBuilder";
import { TDirection } from "../../eloquent/interfaces/TEnums";
import PostgresAdapter from "../adapters/PostgresAdapter";
import { ICtor } from "@src/core/interfaces/ICtor";
import ExpressionBuilder from "../builder/ExpressionBuilder/ExpressionBuilder";

type Adapter = PostgresAdapter

class PostgresQueryBuilder<T extends IModel = IModel> extends BaseQueryBuilder<T, Adapter> {

    constructor(modelCtor: ICtor<IModel>) {
        super({
            adapterName: 'postgres',
            modelCtor,
            expressionBuilderCtor: ExpressionBuilder
        })
    }
    
    find(id: unknown): T | null {
        return this.captureError(async () => {
            const client = this.getDatabaseAdapter().getPgClient();

            const sql 

            return await client.query({
                text: 'SELECT * FROM "public"."users" WHERE "id" = $1',
                values: [id]
            })
        })
    }

    findOrFail(id: unknown): T {
        throw new Error("Method not implemented: findOrFail");
    }

    async get(): Promise<ICollection<T>> {
        throw new Error("Method not implemented: get");
    }

    async all(): Promise<ICollection<T>> {
        throw new Error("Method not implemented: all");
    }

    first(): T | null {
        throw new Error("Method not implemented: first");
    }

    last(): T | null {
        throw new Error("Method not implemented: last");
    }

    select(columns?: string | string[]): IQueryBuilder {
        throw new Error("Method not implemented: select");
    }

    selectRaw(expression: string, bindings?: any[]): IQueryBuilder {
        throw new Error("Method not implemented: selectRaw");
    }

    distinct(): IQueryBuilder {
        throw new Error("Method not implemented: distinct");
    }

    where(column: string, operator?: string, value?: any): IQueryBuilder {
        throw new Error("Method not implemented: where");
    }

    whereIn(column: string, values: any[]): IQueryBuilder {
        throw new Error("Method not implemented: whereIn");
    }

    whereNotIn(column: string, values: any[]): IQueryBuilder {
        throw new Error("Method not implemented: whereNotIn");
    }

    whereNull(column: string): IQueryBuilder {
        throw new Error("Method not implemented: whereNull");
    }

    whereNotNull(column: string): IQueryBuilder {
        throw new Error("Method not implemented: whereNotNull");
    }

    whereBetween(column: string, range: [any, any]): IQueryBuilder {
        throw new Error("Method not implemented: whereBetween");
    }

    whereRaw(query: string, bindings?: any[]): IQueryBuilder {
        throw new Error("Method not implemented: whereRaw");
    }

    join(table: string, first: string, operator?: string, second?: string): IQueryBuilder {
        throw new Error("Method not implemented: join");
    }

    leftJoin(table: string, first: string, operator?: string, second?: string): IQueryBuilder {
        throw new Error("Method not implemented: leftJoin");
    }

    rightJoin(table: string, first: string, operator?: string, second?: string): IQueryBuilder {
        throw new Error("Method not implemented: rightJoin");
    }

    crossJoin(table: string): IQueryBuilder {
        throw new Error("Method not implemented: crossJoin");
    }

    orderBy(column: string, direction?: TDirection): IQueryBuilder {
        throw new Error("Method not implemented: orderBy");
    }

    orderByDesc(column: string): IQueryBuilder {
        throw new Error("Method not implemented: orderByDesc");
    }

    latest(column?: string): IQueryBuilder {
        throw new Error("Method not implemented: latest");
    }

    oldest(column?: string): IQueryBuilder {
        throw new Error("Method not implemented: oldest");
    }

    groupBy(...columns: string[]): IQueryBuilder {
        throw new Error("Method not implemented: groupBy");
    }

    having(column: string, operator?: string, value?: any): IQueryBuilder {
        throw new Error("Method not implemented: having");
    }

    limit(value: number): IQueryBuilder {
        throw new Error("Method not implemented: limit");
    }

    offset(value: number): IQueryBuilder {
        throw new Error("Method not implemented: offset");
    }

    skip(value: number): IQueryBuilder {
        throw new Error("Method not implemented: skip");
    }

    take(value: number): IQueryBuilder {
        throw new Error("Method not implemented: take");
    }

    async count(column?: string): Promise<number> {
        throw new Error("Method not implemented: count");
    }

    async max(column: string): Promise<number> {
        throw new Error("Method not implemented: max");
    }

    async min(column: string): Promise<number> {
        throw new Error("Method not implemented: min");
    }

    async avg(column: string): Promise<number> {
        throw new Error("Method not implemented: avg");
    }

    async sum(column: string): Promise<number> {
        throw new Error("Method not implemented: sum");
    }

    async paginate(perPage?: number, page?: number): Promise<{ 
        data: any[];
        total: number;
        currentPage: number;
        lastPage: number;
        perPage: number;
    }> {
        throw new Error("Method not implemented: paginate");
    }

}

export default PostgresQueryBuilder;