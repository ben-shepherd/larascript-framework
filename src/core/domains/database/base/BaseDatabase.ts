import HasRegisterableConcern from "@src/core/concerns/HasRegisterableConcern";
import compose from "@src/core/util/compose";

const BaseDatabase = compose(class {}, HasRegisterableConcern)

export default BaseDatabase