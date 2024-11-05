import BaseCastable from "../base/BaseCastable";
import { TCasts } from "../interfaces/concerns/IHasCastableConcern";

const castObject = <ReturnType = unknown>(data: unknown, casts: TCasts): ReturnType => {
    return new BaseCastable().getCastFromObject<ReturnType>(data as Record<string, unknown>, casts)
}

export default castObject