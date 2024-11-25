import Collection from "../Collection";
import ProxyCollectionHandler from "../ProxyCollectionHandler";

/**
 * Creates a new proxy collection from the given items. The proxy collection
 * supports accessing the underlying items using numerical indexes.
 *
 * @template T The type of the items in the collection.
 * @param items The items to create a collection from.
 * @returns A new proxy collection with the given items.
 */
const collect = <T = unknown>(items: T[] = []): Collection<T> => {
    const proxyCollectionHandler = new ProxyCollectionHandler()
    const collection = new (class extends Collection<T> {})(items);

    return new Proxy(collection, proxyCollectionHandler) as Collection<T>;
}

export default collect