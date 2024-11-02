import HasRegisterableConcern from "@src/core/concerns/HasRegisterableConcern";
import EventMockableConcern from "@src/core/domains/events/concerns/EventMockableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";
import compose from "@src/core/util/compose";

const BaseService: ICtor = compose(
    class {},
    HasRegisterableConcern,
    EventMockableConcern,
);

export default BaseService