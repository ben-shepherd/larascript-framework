import { TCasts } from "@src/core/domains/cast/interfaces/IHasCastableConcern";
import BaseCastable from "@src/core/domains/cast/base/BaseCastable";

const castObject = <ReturnType = unknown>(data: unknown, casts: TCasts): ReturnType => {
    return new BaseCastable().getCastFromObject<ReturnType>(data as Record<string, unknown>, casts)
}

export default castObject