import { IHasCastableConcern } from "@src/core/domains/cast/interfaces/IHasCastableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";
import compose from "@src/core/util/compose";

import HasCastableConcern from "../concerns/HasCastableConcern";

const BaseCastable: ICtor<IHasCastableConcern> = compose(class {}, HasCastableConcern)

export default BaseCastable