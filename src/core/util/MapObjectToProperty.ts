import BaseFormatter from "../domains/formatter/base/BaseFormatter"

export type MapObjectToPropertyOptions = {
    targetProperty: string
    mapToProperty: string
}
export type MapObjectToPropertyOptionsArray = MapObjectToPropertyOptions[]

class MapObjectToProperty extends BaseFormatter<MapObjectToPropertyOptionsArray> {

    /**
     * The formatter options.
     */
    formatterOptions: MapObjectToPropertyOptionsArray = []

    /**
     * Formats the data.
     * @param dataArray The array of objects to format.
     * @param options The options for the formatting.
     * @returns The formatted data.
     */
    format<T>(dataArray: object[], options: MapObjectToPropertyOptionsArray = this.formatterOptions): T {
        return MapObjectToProperty.handleArray(dataArray, options) as T
    }

    /**
     * Maps the object to the target property.
     * @param dataArray The array of objects to map.
     * @param options The options for the mapping.
     * @returns The array of objects with the mapped properties.
     */
    static handleArray(dataArray: object[], options: MapObjectToPropertyOptionsArray): object[] {
        return dataArray.map((current) => {
            return options.map((option) => {
                return this.handleItem(current, option)
            })
        })
    }

    /**
     * Maps the object to the target property.
     * @param item The object to map.
     * @param options The options for the mapping.
     * @returns The object with the mapped property.
     */
    static handleItem(item: object, options: { targetProperty: string, mapToProperty: string }): object {
        const { targetProperty, mapToProperty } = options

        if(item[targetProperty]) {
            item[targetProperty] = item[mapToProperty]
            delete item[mapToProperty]
            return item
        }

        return item
    }

}

export default MapObjectToProperty