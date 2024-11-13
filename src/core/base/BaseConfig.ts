import BaseModel from "@src/core/base/BaseModel";
import HasConfigConcern from "@src/core/concerns/HasConfigConcern";
import compose from "@src/core/util/compose";

export default class BaseConfig extends compose(BaseModel, HasConfigConcern) {}