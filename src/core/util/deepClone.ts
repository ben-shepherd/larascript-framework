import * as _ from 'lodash'

export function deepClone<T>(obj: T): T {
    return _.cloneDeep(obj) as T
}