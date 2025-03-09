/* eslint-disable no-unused-vars */
import HasConfigConcern from "@src/core/concerns/HasConfigConcern";
import compose from "@src/core/util/compose";

export default class BaseConfig extends compose(class {}, HasConfigConcern) {

    declare getConfig: <T = unknown>() => T;
    
    declare setConfig: (config: unknown) => void;

}