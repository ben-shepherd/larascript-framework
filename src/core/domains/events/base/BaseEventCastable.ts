import HasCastableConcern from "@src/core/concerns/HasCastableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";
import compose from "@src/core/util/compose";

const BaseEventCastable: ICtor = compose(class {}, HasCastableConcern)

export default BaseEventCastable