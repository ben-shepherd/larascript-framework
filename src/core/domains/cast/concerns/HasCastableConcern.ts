import { ICtor } from "@src/core/interfaces/ICtor";

import { TCastableType } from "../interfaces/IHasCastableConcern";
import Castable from "../service/Castable";

const HasCastableConcernMixin = (Base: ICtor) => {
    return class extends Base {

        private castable = new Castable();

        getCastFromObject<ReturnType = unknown>(data: Record<string, unknown>, casts = this.casts): ReturnType {
            return this.castable.getCastFromObject(data, casts);
        }

        getCast<T = unknown>(data: unknown, type: TCastableType): T {
            return this.castable.getCast(data, type);
        }

        isValidType(type: TCastableType): boolean {
            return this.castable.isValidType(type);
        }

        casts = {};
    
    }
}

export default HasCastableConcernMixin;