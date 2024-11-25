import { Collection as CollectJsCollection } from "collect.js";

import { TForeachCallback, TMapCallback, TOperator } from "./interfaces/ICollection";

abstract class Collection<T = unknown> {

    /**
     * Array of items
     */
    protected items: T[];


    /**
     * @param items
     */
    constructor(items: T[] = []) {
        this.items = items;
    }

    /**
     * Get the underlying CollectJs Collection
     *
     * @return CollectJsCollection<T>
     */
    toCollectJs(): CollectJsCollection<T> {
        return new CollectJsCollection(this.items);
    }

    /**
     * Iterable methods
     */
    forEach(callback: TForeachCallback<T>): this {
        this.items.forEach(callback);
        return this
    }


    map(callback: TMapCallback<T, T>): this {
        this.items = this.items.map(callback);
        return this
    }

    /**
     * Getters and setters
     */
    all(): T[] {
        return this.items;
    }

    toArray(): T[] {
        return this.items;
    }

    get(index: number): T {
        return this.items[index];
    }

    set(index: number, value: T): void {
        this.items[index] = value;
    }

    add(item: T): this {
        this.items.push(item);
        return this
    }

    remove(index: number): this {
        this.items.splice(index, 1);
        return this
    }

    first(): T | null {
        return this.items?.[0] ?? null;
    }

    last(): T | null {
        return this.items?.[this.items.length - 1] ?? null;
    }

    /**
     * Aggregations
     */
    count(): number {
        return this.items.length;
    }

    sum(column: string): number | string  {
        return this.toCollectJs().sum(column);
    }

    average(column: string): number {
        return this.toCollectJs().avg(column);
    }

    max(column: string): number {
        return this.toCollectJs().max(column);
    }

    min(column: string): number {
        return this.toCollectJs().min(column);
    }

    /**
     * Filtering methods
     */
    where(column: string, operator: TOperator, value: any): this {
        this.items = this.toCollectJs().where(column, operator, value).all();
        return this
    }

    /**
     * Utiliy
     */
    clone(): this {
        return new (this.constructor as any)([...this.items]);
    }

}

export default Collection;