export type TBinding = {
    sql: string;
    value: unknown;
}

/**
 * Helper class to manage bindings for a query builder.
 */
class BindingsHelper {

    protected bindings: TBinding[] = [];

    /**
     * Adds a binding to the builder.
     * The binding is an object with two properties: `sql` and `value`.
     * The `sql` property is the SQL placeholder string, and the `value` property
     * is the value that will be bound to the placeholder.
     * @param {unknown} value The value to bind.
     */
    addBindings(values: unknown): this {
        const valuesArray: unknown[] = Array.isArray(values) ? values : [values];

        for(const value of valuesArray) {
            this.bindings.push({
                sql: '$' + this.getNextBindingSql(),
                value
            })   
        }

        return this
    }

    /**
     * Adds the given values as bindings to the builder and returns an array of
     * the corresponding SQL placeholder strings.
     * @param {unknown[]} values The values to add as bindings.
     * @returns {string[]} e.g ['$1', '$2', '$3']
     */
    valuesToPlaceholderSqlArray(values: unknown[]): string[] {
        this.addBindings(values)
        const lastBindings = this.bindings.slice(-values.length)
        return lastBindings.map(({ sql }) => sql)
    }

    /**
     * Retrieves the list of values that have been added to the builder as bindings.
     * This can be useful for debugging or logging purposes.
     * @returns {unknown[]} The list of values
     */
    getValues(): unknown[] {
        return this.bindings.map(({ value }) => value)
    }

    /**
     * Retrieves the list of bindings that have been added to the builder.
     * Each binding is an object with two properties: `sql` and `value`.
     * The `sql` property is the SQL placeholder string, and the `value` property
     * is the value that will be bound to the placeholder.
     * 
     * @returns {TBinding[]} The list of bindings.
     */
    getBindings(): TBinding[] {
        return this.bindings
    }

    /**
     * Retrieves the last binding added to the builder, or null if no bindings have been added.
     * @returns {TBinding | null} The last binding, or null if no bindings have been added.
     */
    getLastBinding(): TBinding | null {
        return this.bindings[this.bindings.length - 1] ?? null
    }

    /**
     * Calculates the SQL placeholder index for the next binding.
     * 
     * @returns {string} The SQL placeholder index starting from 1.
     */
    protected getNextBindingSql() {
        return `${this.bindings.length + 1}`
    }

}

export default BindingsHelper