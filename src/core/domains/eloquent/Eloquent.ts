import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";
import { deepClone } from "@src/core/util/deepClone";

import PrefixedPropertyGrouper, { PrefixToTargetPropertyOptions } from "../../util/PrefixedPropertyGrouper";
import Collection from "../collections/Collection";
import { IDatabaseAdapter } from "../database/interfaces/IDatabaseAdapter";
import BaseEloquent from "./base/BaseEloquent";
import Direction from "./enums/Direction";
import EloquentException from "./exceptions/EloquentExpression";
import ExpressionException from "./exceptions/ExpressionException";
import InvalidMethodException from "./exceptions/InvalidMethodException";
import MissingTableException from "./exceptions/MissingTableException";
import QueryBuilderException from "./exceptions/QueryBuilderException";
import { IEloquent, LogicalOperators, OperatorArray, QueryOptions, SetModelColumnsOptions, TColumn, TFormatterFn, TLogicalOperator, TOperator, TWhereClauseValue } from "./interfaces/IEloquent";
import IEloquentExpression from "./interfaces/IEloquentExpression";
import { TDirection } from "./interfaces/TEnums";
import With from "./relational/With";

export type TQueryBuilderOptions = {
    adapterName: string,
    connectionName: string;
    tableName?: string;
    formatterFn?: TFormatterFn;
    expressionCtor: ICtor<IEloquentExpression>;
}

abstract class Eloquent<
    Data,
    Adapter extends IDatabaseAdapter = IDatabaseAdapter,
    Expression extends IEloquentExpression = IEloquentExpression> extends BaseEloquent implements IEloquent<Data, Expression> {

    /**
     * The connection name to use for the query builder
    */
    protected connectionName!: string;

    /**
     * The table name to use for the query builder
     */
    protected tableName?: string;
    
    /**
     * The columns to select from the database
     */
    protected columns: string[] = [];

    /**
     * The adapter name to use for the query builder (logging purposes)
     */
    protected adapterName!: string;

    /**
     * Formatter function to transform row result
     */
    protected formatterFn?: TFormatterFn;

    /**
     * The constructor of the expression builder
     */
    protected expressionCtor!: ICtor<Expression>;

    /**
     * The expression builder
     */
    protected expression!: Expression;

    /**
     * The constructor of the model
     */
    protected modelCtor?: ICtor<IModel>;

    
    /**
     * Prefixed properties to target property as object options
     */
    protected formatResultTargetPropertyToObjectOptions: PrefixToTargetPropertyOptions = [];

    /**
     * Creates a new Eloquent query builder instance with specified options.
     *
     * @template Data - The type of data to be queried, defaults to object.
     * @param {QueryOptions} options - The options for the query builder including:
     *   @param {string} options.connectionName - The name of the database connection to use.
     *   @param {string} [options.tableName] - Optional table name to use for the query. Defaults to model's table name.
     *   @param {ICtor<IModel>} options.modelCtor - The constructor of the model to use for the query builder.
     * @returns {IEloquent<Data>} A query builder instance configured with the specified options.
     */
    static query<Data>(connectionName: string, tableName?: string): IEloquent<Data> {
        return new (this.constructor as ICtor<IEloquent<Data>>)()
            .setConnectionName(connectionName)
            .setTable(tableName ?? '')
    }

    /**
     * Retrieves the database adapter for the connection name associated with this query builder.
     * @returns {IDatabaseAdapter} The database adapter.
     */
    protected getAdapter(): Adapter {
        return App.container('db').getAdapter<Adapter>(this.getConnectionName())
    }
    
    /**
     *
     * @param rows 
     * @returns 
     */
    protected formatQueryResults(rows: unknown[]): Data[] {
        return rows.map(row => {
            return this.formatterFn ? this.formatterFn(row) : row
        }) as Data[]
    }

    /**
     * Logs a message to the logger as an error with the query builder's
     * adapter name prefixed.
     * @param {string} message The message to log
     */
    protected log(message: string, ...args: any[]) {
        App.container('logger').error(`[Eloquent] (Connection: ${this.connectionName}): ${message}`, ...args);
    }

    /**
     * Retrieves the table name associated with the model for this query builder
     * @returns {string} The table name
     */
    protected getTable() {
        return this.tableName
    }

    /**
     * Sets the columns to select for the query builder.
     * @param {string[]} columns - The columns to set for selection.
     * @returns {IEloquent<Data>} The query builder instance.
     */
    protected setColumns(columns: string[]): IEloquent<Data> {
        const columnsTyped = columns.map(column => ({column})) as TColumn[]
        this.expression.setColumns(columnsTyped);
        return this as unknown as IEloquent<Data>;
    }


    /**
     * Retrieves the connection name associated with this query builder.
     * @returns {string} The connection name.
     */
    protected getConnectionName(): string {
        return this.connectionName
    }

    /**
     * Adds a key-value pair to the map that prefixes results to properties.
     * 
     * This method is used to map specific keys to their prefixed property names
     * for query results processing.
     * 
     * @param {string} prefix - The prefix to map.
     * @param {string} property - The target property name.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    protected addFormatResultTargetPropertyToObject(prefix: string, property: string): IEloquent<Data> {
        this.formatResultTargetPropertyToObjectOptions.push({columnPrefix: prefix, targetProperty: property, setNullObjectIfAllNull: true })
        return this as unknown as IEloquent<Data>
    }
        
    /**
     * Sets the key-value pairs to the map that prefixes results to properties.
     * 
     * This method is used to set the key-value pairs for mapping specific keys to
     * their prefixed property names for query results processing.
     * 
     * @param {PrefixToTargetPropertyOptions} options - The key-value pairs to map.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    protected setFormatResultTargetPropertyToObject(options: PrefixToTargetPropertyOptions): IEloquent<Data> {
        this.formatResultTargetPropertyToObjectOptions = options
        return this as unknown as IEloquent<Data>
    }

    /**
     * Processes an array of objects by moving properties that match a specified
     * prefix to a nested object specified by the property name.
     * 
     * This is useful when you have a result set that is dynamically generated
     * and you want to map the results to a specific object structure.
     * 
     * Example:
     * const result = [
     *   { prefix_id: 1, prefix_name: 'John Doe' },
     *   { prefix_id: 2, prefix_name: 'Jane Doe' },
     * ]
     * const options = [
     *   { prefix: 'prefix_', property: 'targetProperty' }
     * ]
     * 
     * prefixedPropertiesToTargetPropertyAsObject(result, options)
     * 
     * // result is now:
     * [
     *   { targetProperty: { id: 1, name: 'John Doe' } },
     *   { targetProperty: { id: 2, name: 'Jane Doe'} },
     * ]
     * @param {T[]} results The array of objects to process.
     * @returns {T[]} The processed array of objects.
     */
    protected applyFormatResultTargetPropertyToObject<T extends object = object>(results: T[]): T[] {
        return PrefixedPropertyGrouper.handleArray<T>(results, this.formatResultTargetPropertyToObjectOptions)
    }

    /**
     * Retrieves the current expression builder instance.
     *
     * @returns {Expression} The expression builder instance.
     */
    getExpression(): Expression {
        return this.expression
    }

    /**
     * Sets the expression builder instance to use for the query builder.
     * 
     * @param {Expression} expression - The expression builder instance to use.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    setExpression(expression: Expression): IEloquent<Data> {
        this.expression = expression
        return this as unknown as IEloquent<Data>
    }

    /**
     * Sets the expression builder to use for the query builder.
     * 
     * @param {ICtor<IEloquentExpression>} builderCtor The constructor of the expression builder to use.
     * @returns {this} The query builder instance for chaining.
     */
    setExpressionCtor(builderCtor: ICtor<Expression>): IEloquent<Data> {
        this.expressionCtor = builderCtor;
        this.expression = new builderCtor();
        return this as unknown as IEloquent<Data>
    }

    /**
     * Resets the expression builder to its default state.
     * 
     * This method is a convenience wrapper around the expression builder's
     * `reset` method.
     * 
     * @returns {IEloquentExpression} The expression builder instance after resetting.
     */
    resetExpression(): IEloquent<Data> {
        this.setExpressionCtor(this.expressionCtor)
        this.setTable(this.tableName ?? '')
        return this as unknown as IEloquent<Data>
    }

    /**
     * Retrieves a clone of the expression builder associated with this query builder.
     *
     * The cloned expression builder will not be associated with the same model as
     * the original expression builder.
     *
     * @returns {IEloquentExpression} The cloned expression builder instance.
     */
    cloneExpression(): IEloquentExpression {
        return this.expression.clone()
    }

    /**
     * Sets the constructor of the model associated with the query builder.
     * 
     * If no model constructor is provided, the query builder will not be associated
     * with any model.
     * 
     * @param {ICtor<IModel>} [modelCtor] The constructor of the model to associate with the query builder.
     * @returns {this} The query builder instance for chaining.
     */
    setModelCtor(modelCtor?: ICtor<IModel>): IEloquent<Data> {
        this.modelCtor = modelCtor
        return this as unknown as IEloquent<Data>
    }

    /**
     * Sets the columns for the query builder based on the fields of the associated model.
     * 
     * This method initializes an instance of the model using its constructor,
     * retrieves the fields of the model, and sets each field as a column in the query builder.
     * 
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    setModelColumns(modelCtor?: ICtor<IModel>, options: SetModelColumnsOptions = {}): IEloquent<Data> {
        modelCtor = typeof modelCtor === 'undefined' ? this.modelCtor : modelCtor
        
        if(!modelCtor) {
            throw new EloquentException('Model constructor has not been set');
        }

        const model = new modelCtor(null)
        const tableName = model.useTableName()
        const fields = model.getFields()

        fields.forEach(field => {

            if(options.columnPrefix) {
                this.column({ column: field, tableName, as: `${options.columnPrefix}${field}` })
                return;
            }

            this.column({ column: field, tableName })
        });
        
        return this as unknown as IEloquent<Data>
    }

    /**
     * Retrieves the constructor of the model associated with the query builder.
     *
     * @returns {ICtor<IModel>} The constructor of the model.
     */
    getModelCtor(): ICtor<IModel> | undefined {
        return this.modelCtor
    }

    /**
     * Returns a new query builder instance that is associated with the provided model constructor.
     * The returned query builder instance is a clone of the current query builder and is associated
     * with the provided model constructor.
     * @template Model The type of the model to associate with the query builder.
     * @returns {IEloquent<Model>} A new query builder instance associated with the provided model constructor.
     */
    asModel<Model extends IModel>(): IEloquent<Model> {
        if(!this.modelCtor) {
            throw new EloquentException('Model constructor has not been set');
        }

        const modelCtor = this.modelCtor as ICtor<Model>

        return this.clone<Model>()
            .setExpression(this.expression.clone())
            .setModelCtor(modelCtor)
            .setFormatter((row) => new modelCtor(row))
    }

    /**
     * Sets the formatter function for the query builder. This function will be
     * called with each row of the result as an argument. The function should
     * return the transformed row.
     *
     * @param {TFomatterFn} formatterFn The formatter function to set
     * @returns {this} The query builder instance to enable chaining
     */
    setFormatter(formatterFn?: TFormatterFn): IEloquent<Data> {
        this.formatterFn = formatterFn 
        return this as unknown as IEloquent<Data>
    }

    /**
     * Sets the table name to use for the query builder.
     * 
     * This is a convenience method for {@link setTable}.
     * 
     * @param {string} tableName The table name to set.
     * @returns {this} The query builder instance for chaining.
     */
    setTable(tableName: string): IEloquent<Data> {
        this.tableName = tableName
        this.expression.setTable(tableName);
        return this as unknown as IEloquent<Data>
    }
    
    /**
     * Retrieves the table name associated with the query builder, or throws an
     * exception if it is not set.
     * 
     * @returns {string} The table name
     * @throws {MissingTableException} If the table name is not set
     */
    useTable(): string {
        if(!this.tableName || this.tableName?.length === 0) {
            throw new MissingTableException()
        }
        return this.tableName
    }
    
    /**
     * Sets the connection name to use for the query builder
     * @param {string} connectionName The connection name to use
     */
    setConnectionName(connectionName: string): IEloquent<Data> {
        this.connectionName = connectionName
        return this as unknown as IEloquent<Data>;
    }

    /**
     * Sets the columns to select for the query builder.
     * @param {string|string[]} [columns='*'] The columns to set for selection.
     * @returns {IEloquent<Data>} The query builder instance.
     */
    select(columns?: string | string[]): IEloquent<Data> {

        if(columns === undefined) {
            this.columns = ['*'];
            return this as unknown as IEloquent<Data>;
        }

        if(typeof columns === 'string' && columns === '*') {
            this.columns = ['*'];
        }

        this.setColumns(Array.isArray(columns) ? columns : [columns])
        return this as unknown as IEloquent<Data>;
    }

    /**
     * Adds a column to the columns array to be included in the SQL query.
     * If the column is already in the array, it will not be added again.
     * @param {string | TColumn} column The column name to add to the array.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    column(column: TColumn | string): IEloquent<Data> {
        if(typeof column === 'string') {
            column = {column}
        }
        this.expression.addColumn(column);
        return this as unknown as IEloquent<Data>
    }

    /**
     * Sets a raw select expression for the query builder.
     * 
     * This method can be used to set a custom select expression on the query builder.
     * The expression will be used as the SELECT clause for the query.
     * 
     * @param {string} expression - The raw select expression to set.
     * @param {unknown[]} [bindings] - The bindings to use for the expression.
     * @returns {IEloquent<Data, IEloquentExpression<unknown>>} The query builder instance.
     */
    selectRaw(expression: string, bindings?: unknown[]): IEloquent<Data, IEloquentExpression<unknown>> {
        this.expression.setSelectRaw(expression, bindings);
        return this as unknown as IEloquent<Data, IEloquentExpression<unknown>>
    }

    /**
     * Sets the distinct columns for the query builder
     * @param {string|string[]} columns The columns to set for distinct
     * @returns {IEloquent<Data>} The query builder instance
     */
    distinct(columns: string | string[]): IEloquent<Data> {
        columns = Array.isArray(columns) ? columns : [columns];
        const columnsTyped = columns.map(column => ({column})) as TColumn[]
        
        this.expression.setDistinctColumns(columnsTyped);
        return this as unknown as IEloquent<Data>;
    }
    
    /**
     * Clones the query builder instance.
     *
     * The cloned instance will have the same model constructor associated with it.
     * @returns {IEloquent} The cloned query builder instance
     */
    clone<T = Data>(): IEloquent<T> {
        return deepClone<IEloquent<T>>(this as unknown as IEloquent<T>)
            .setExpression(this.expression.clone())
    }

    // eslint-disable-next-line no-unused-vars
    async createDatabase(name: string): Promise<void> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async databaseExists(name: string): Promise<boolean> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async dropDatabase(name: string): Promise<void> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async createTable(name: string, ...args: any[]): Promise<void> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async dropTable(name: string, ...args: any[]): Promise<void> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async tableExists(name: string): Promise<boolean> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async alterTable(name: string, ...args: any[]): Promise<void> {
        throw new InvalidMethodException()
    }

    async dropAllTables(): Promise<void> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async execute<T>(builder: IEloquentExpression): Promise<T> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async raw<T>(expression: string, bindings?: unknown[]): Promise<T> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async find(id: string | number): Promise<Data | null> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async findOrFail(id: string | number): Promise<Data> {
        throw new InvalidMethodException()
    }

    async get(): Promise<Collection<Data>> {
        throw new InvalidMethodException()
    }

    async all(): Promise<Collection<Data>> {
        throw new InvalidMethodException()
    }

    async first(): Promise<Data | null> {
        throw new InvalidMethodException()
    }

    async firstOrFail(): Promise<Data> {
        throw new InvalidMethodException()
    }

    async last(): Promise<Data | null> {
        throw new InvalidMethodException()
    }

    async lastOrFail(): Promise<Data> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async insert(documents: object | object[]): Promise<Collection<Data>> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async update(documents: object | object[]): Promise<Collection<Data>> {
        throw new InvalidMethodException()
    }

    // eslint-disable-next-line no-unused-vars
    async updateAll(documents: object | object[]): Promise<Collection<Data>> {
        throw new InvalidMethodException()
    }

    /**
     * Adds a where clause to the query builder.
     *
     * @param {string} column - The column to apply the where condition on.
     * @param {TOperator} [operator] - The operator to use for comparison.
     * @param {TWhereClauseValue} [value] - The value to compare against.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     * @throws {QueryBuilderException} If an invalid or missing operator is provided.
     */
    where(column: string, operator?: TOperator, value?: TWhereClauseValue, logicalOperator: TLogicalOperator = LogicalOperators.AND): IEloquent<Data> {

        // Handle default equals case
        if(value === undefined) {
            this.expression.where(column, '=', operator as TWhereClauseValue, logicalOperator);
            return this as unknown as IEloquent<Data>
        }

        // Check operator has been provided and matches expected value
        if(operator === undefined || OperatorArray.includes(operator) === false) {
            throw new QueryBuilderException('Operator is required')
        }

        this.expression.addWhere({
            column,
            operator,
            value,
            tableName: this.useTable()
        })
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a raw where clause to the query builder.
     *
     * @param {Q} sql - The raw SQL to use for the where clause.
     * @param {Bindings} [bindings] - The bindings to use for the where clause.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    whereRaw<Q = string, Bindings = unknown>(sql: Q, bindings?: Bindings): IEloquent<Data> {
        this.expression.whereRaw(sql as string, bindings);
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds an or where clause to the query builder.
     *
     * @param {string} column - The column to apply the where condition on.
     * @param {TOperator} [operator] - The operator to use for comparison.
     * @param {TWhereClauseValue} [value] - The value to compare against.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     * @throws {QueryBuilderException} If an invalid or missing operator is provided.
     */
    orWhere(column: string, operator?: TOperator, value?: TWhereClauseValue): IEloquent<Data> {
        return this.where(column, operator, value, LogicalOperators.OR)
    }


    /**
     * Adds a where in clause to the query builder.
     * 
     * @param {string} column - The column to apply the where in condition on.
     * @param {TWhereClauseValue[]} values - An array of values to compare against.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    whereIn(column: string, values: TWhereClauseValue[]): IEloquent<Data> {
        this.expression.addWhere({column, operator: 'in', value: values, tableName: this.useTable()});
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a where not in clause to the query builder.
     * 
     * This method allows for filtering the query results by excluding rows
     * where the specified column's value is within the given array of values.
     * 
     * @param {string} column - The column to apply the where not in condition on.
     * @param {TWhereClauseValue[]} values - An array of values to exclude.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    whereNotIn(column: string, values: any[]): IEloquent<Data> {
        this.expression.addWhere({column, operator: 'not in', value: values, tableName: this.useTable()});
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a where null clause to the query builder.
     * 
     * @param {string} column - The column to apply the where null condition on.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    whereNull(column: string): IEloquent<Data> {
        this.expression.addWhere({column, operator: 'is null', value: null, tableName: this.useTable()});
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a where not null clause to the query builder.
     * 
     * This method allows for filtering the query results by including only rows
     * where the specified column's value is not null.
     * 
     * @param {string} column - The column to apply the where not null condition on.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    whereNotNull(column: string): IEloquent<Data> {
        this.expression.addWhere({column, operator: 'is not null', value: null, tableName: this.useTable()});
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a where between clause to the query builder.
     * 
     * This method allows for filtering the query results by including only rows
     * where the specified column's value is between the two values in the given
     * range.
     * 
     * @param {string} column - The column to apply the where between condition on.
     * @param {[TWhereClauseValue, TWhereClauseValue]} range - An array of two values to compare against.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    whereBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IEloquent<Data> {
        this.expression.addWhere({column, operator: 'between', value: range, tableName: this.useTable()});
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a where not between clause to the query builder.
     * 
     * This method allows for filtering the query results by excluding rows
     * where the specified column's value is not between the two values in the given
     * range.
     * 
     * @param {string} column - The column to apply the where not between condition on.
     * @param {[TWhereClauseValue, TWhereClauseValue]} range - An array of two values to compare against.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    whereNotBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IEloquent<Data> {
        this.expression.addWhere({column, operator: 'not between', value: range, tableName: this.useTable()});
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a where like clause to the query builder.
     * 
     * This method allows for filtering the query results by including only rows
     * where the specified column's value matches the given value using the LIKE operator.
     * 
     * @param {string} column - The column to apply the where like condition on.
     * @param {TWhereClauseValue} value - The value to compare against.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    whereLike(column: string, value: TWhereClauseValue): IEloquent<Data> {
        this.expression.addWhere({column, operator: 'like', value, tableName: this.useTable()});
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a where not like clause to the query builder.
     * 
     * This method allows for filtering the query results by excluding rows
     * where the specified column's value does not match the given value using the NOT LIKE operator.
     * 
     * @param {string} column - The column to apply the where not like condition on.
     * @param {TWhereClauseValue} value - The value to compare against.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    whereNotLike(column: string, value: TWhereClauseValue): IEloquent<Data> {
        this.expression.addWhere({column, operator: 'not like', value, tableName: this.useTable()});
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a relationship to the query builder.
     * 
     * This method allows for loading the related data of the model being queried.
     * 
     * @param {string} relationship - The name of the relationship to load.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    with(relationship: string): IEloquent<Data> { 
        if(!this.modelCtor) {
            throw new ExpressionException('Model constructor has not been set');
        }
        
        return new With(this, relationship).applyOnExpression()
    }

    /**
     * Adds an inner join to the query builder.
     * 
     * @param {string} table - The table to join.
     * @param {string} relatedTable - The table to join with.
     * @param {string} localColumn - The column to join on in the left table.
     * @param {string} relatedColumn - The column to join on in the right table.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    join(relatedTable: string, localColumn: string, relatedColumn: string ): IEloquent<Data> {
        const localTable = this.useTable()
        this.expression.setJoins({ localTable, localColumn, relatedTable, relatedColumn, type: 'inner' });
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a left join to the query builder.
     * 
     * @param {string} relatedTable - The table to join with.
     * @param {string} localColumn - The column to join on in the left table.
     * @param {string} relatedColumn - The column to join on in the right table.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    leftJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Data> {
        const localTable = this.useTable()
        this.expression.setJoins({ localTable, localColumn, relatedTable, relatedColumn, type: 'left' });
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a right join to the query builder.
     * 
     * @param {string} relatedTable - The table to join with.
     * @param {string} localColumn - The column to join on in the left table.
     * @param {string} relatedColumn - The column to join on in the right table.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    rightJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Data> {
        const localTable = this.useTable()
        this.expression.setJoins({ localTable, localColumn, relatedTable, relatedColumn, type: 'right' });
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a full join to the query builder.
     *
     * This method allows for joining two tables using a full join, which returns
     * all records when there is a match in either left or right table records.
     *
     * @param {string} relatedTable - The table to join with.
     * @param {string} localColumn - The column to join on in the left table.
     * @param {string} relatedColumn - The column to join on in the right table.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    fullJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Data> {
        const localTable = this.useTable()
        this.expression.setJoins({ localTable, localColumn, relatedTable, relatedColumn, type: 'full' });
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds a cross join to the query builder.
     * 
     * @param {string} relatedTable - The table to join with.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    crossJoin(relatedTable: string) {
        this.expression.setJoins({ relatedTable, type: 'cross' });
        return this as unknown as IEloquent<Data>
    }

    /**
     * Adds an order by clause to the query builder.
     * `
     * @param {string} column - The column to order by.
     * @param {TDirection} direction - The direction to order by. Defaults to 'asc'.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    orderBy(column: string, direction: TDirection = 'asc'): IEloquent<Data> {
        this.expression.orderBy({ column, direction });
        return this as unknown as IEloquent<Data>
    }

    /**
     * Orders the query builder by the given column in descending order.
     * 
     * This method is an alias for orderBy(column, 'desc').
     * 
     * @param {string} column - The column to order by.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    latest(column: string): IEloquent<Data> {
        this.expression.orderBy({ column, direction: Direction.DESC});
        return this as unknown as IEloquent<Data>
    }

    /**
     * Orders the query builder by the given column in descending order.
     * 
     * This method is an alias for orderBy(column, 'desc').
     * 
     * @param {string} column - The column to order by.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    newest(column: string): IEloquent<Data> {
        return this.latest(column)
    }

    /**
     * Orders the query builder by the given column in ascending order.
     * 
     * This method is an alias for orderBy(column, 'asc').
     * 
     * @param {string} column - The column to order by.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    oldest(column: string): IEloquent<Data> {
        return this.orderBy(column, Direction.ASC)
    }


    /**
     * Sets the offset for the query builder.
     * 
     * @param {number} offset - The value of the offset to set.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    offset(offset: number): IEloquent<Data> {
        this.expression.setOffset(offset);
        return this as unknown as IEloquent<Data>
    }
    
    /**
     * Sets the offset for the query builder.
     * 
     * This method is an alias for the `offset` method.
     * 
     * @param {number} skip - The value of the offset to set.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    skip(skip: number): IEloquent<Data> {
        return this.offset(skip)
    }

    /**
     * Sets the limit clause for the query builder.
     * 
     * @param {number} limit - The limit clause to set.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    limit(limit: number): IEloquent<Data> {
        this.expression.setLimit(limit);
        return this        
    }

    /**
     * Sets the limit clause for the query builder.
     * 
     * This method is an alias for the `limit` method.
     * 
     * @param {number} take - The limit clause to set.
     * @returns {IEloquent<Data>} The query builder instance for chaining.
     */
    take(take: number): IEloquent<Data> {
        return this.limit(take)
    }

}

export default Eloquent