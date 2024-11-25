import Collection from "../Collection";


/**
 * Creates a new proxy collection from the given items. The proxy collection
 * supports accessing the underlying items using numerical indexes.
 *
 * @template T The type of the items in the collection.
 * @param {T[]} [items=[]] The items to create a collection from.
 * @returns {Collection<T>} A new proxy collection with the given items.
 */
const collect = <T = unknown>(items: T[] = []): Collection<T> => {
    return Collection.collect<T>(items)
}

export default collect