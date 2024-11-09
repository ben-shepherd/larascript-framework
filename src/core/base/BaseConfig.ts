import HasConfigConcern from "../concerns/HasConfigConcern";
import compose from "../util/compose";
import BaseModel from "./BaseModel";

export default class BaseConfig extends compose(BaseModel, HasConfigConcern) {}