/* eslint-disable no-unused-vars */
import compose from "@src/core/util/compose";

import DocumentConcernMixin from "../concerns/DocumentConcern";
import { IDocumentConern } from "../interfaces/IDocumentConcern";

class BaseEloquent extends compose(class {}, DocumentConcernMixin) implements IDocumentConern {
    
    /**
     *  DocumentConcern
     */
    declare documentWithUuid: <T>(document: T) => T;
    
    declare documentStripUndefinedProperties: <T>(document: T) => T;


}

export default BaseEloquent