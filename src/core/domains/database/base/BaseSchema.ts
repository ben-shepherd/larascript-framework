import Model from "@src/core/models/base/Model";

class BaseSchema {

    /**
     * Retrieves the table name associated with the given model.
     * The table name is determined by the value of the `table` property of the model.
     * If the `table` property is not set, this method will throw a MissingTableException.
     * Otherwise, the table name is pluralized and lowercased.
     * @param tableName - The name of the table to retrieve.
     * @returns The pluralized and lowercased table name associated with the model.
     * @throws MissingTableException If the table name is not set.
     * @deprecated Should not control the table name. Use `Model.getTable()` instead
     */
    formatTableName(tableName: string): string {
        return Model.formatTableName(tableName)
    }

}

export default BaseSchema