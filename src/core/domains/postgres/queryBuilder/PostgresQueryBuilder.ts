import { IModel } from "@src/core/interfaces/IModel";

import BaseQueryBuilder from "../../eloquent/base/BaseQueryBuilder";

class PostgresQueryBuilder<T extends IModel = IModel> extends BaseQueryBuilder<T> {

}

export default PostgresQueryBuilder