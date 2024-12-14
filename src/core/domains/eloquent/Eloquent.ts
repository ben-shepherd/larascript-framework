/* eslint-disable no-unused-vars */
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";
import { deepClone } from "@src/core/util/deepClone";

import { PrefixToTargetPropertyOptions } from "../../util/PrefixedPropertyGrouper";
import Collection from "../collections/Collection";
import { IDatabaseAdapter } from "../database/interfaces/IDatabaseAdapter";
import Direction from "./enums/Direction";
import EloquentException from "./exceptions/EloquentExpression";
import ExpressionException from "./exceptions/ExpressionException";
import InvalidMethodException from "./exceptions/InvalidMethodException";
import MissingTableException from "./exceptions/MissingTableException";
import QueryBuilderException from "./exceptions/QueryBuilderException";
import { IEloquent, IdGeneratorFn, LogicalOperators, OperatorArray, SetModelColumnsOptions, TColumnOption, TFormatterFn, TGroupBy, TLogicalOperator, TOperator, TWhereClauseValue, TransactionFn } from "./interfaces/IEloquent";
import IEloquentExpression from "./interfaces/IEloquentExpression";
import { TDirection } from "./interfaces/TEnums";
import With from "./relational/With";

/**
 * Base class for Eloquent query builder.
 * Provides database query building and execution functionality.
 * 
 * @template Model - The model type this query builder works with
 * @abstract
 */

abstract class Eloquent<Model extends IModel> implements IEloquent<Model> {

    /**
     * The connection name to use for the query builder
    */
    protected connectionName!: string;

    /**
     * The columns to select from the database
     */
    protected columns: string[] = [];

    /**
     * The logger name to use for the query builder (logging purposes)
     */
    protected loggerName!: string;

    /**
     * Formatter function to transform row result
     */
    protected formatterFn?: TFormatterFn;

    /**
     * The constructor of the expression builder
     */
    protected expressionCtor!: ICtor<IEloquentExpression>;

    /**
     * The expression builder
     */
    protected expression!: IEloquentExpression;

    /**
     * The constructor of the model
     */
    protected modelCtor?: ICtor<IModel>;

    /**
     * Prefixed properties to target property as object options
     */
    protected formatResultTargetPropertyToObjectOptions: PrefixToTargetPropertyOptions = [];

    /**
     * The id generator function
     */
    protected idGeneratorFn?: IdGeneratorFn;

    /**
     * Retrieves the database adapter for the connection name associated with this query builder.
     * @returns {IDatabaseAdapter} The database adapter.
     */
    protected getAdapter<T extends IDatabaseAdapter = IDatabaseAdapter>(): T {
        return App.container('db').getAdapter<T>(this.getConnectionName())
    }
    

    /**
     * Applies the formatter function to the given array of rows.
     * If no formatter function is set, the rows are returned as is.
     * @param {unknown[]} rows The array of rows to apply the formatter to.
     * @returns {Model[]} The formatted array of rows.
     */
    protected applyFormatter(rows: unknown[]): Model[] {
        return rows.map(row => {
            return this.formatterFn ? this.formatterFn(row) : row
        }) as Model[]
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
        return this.expression.getTable();
    }

    /**
     * Sets the columns to select for the query builder.
     * @param {string[]} columns - The columns to set for selection.
     * @returns {IEloquent<Model>} The query builder instance.
     */
    protected setColumns(columns: TColumnOption[]): IEloquent<Model> {
        this.expression.setColumns(columns);
        return this as unknown as IEloquent<Model>;
    }

    /**
     * Retrieves the connection name associated with this query builder.
     * @returns {string} The connection name.
     */
    protected getConnectionName(): string {
        return this.connectionName
    }

    /**
     * Retrieves the current expression builder instance.
     *
     * @returns {Expression} The expression builder instance.
     */
    getExpression<T extends IEloquentExpression = IEloquentExpression>(): T {
        return this.expression as T
    }

    /**
     * Sets the expression builder instance to use for the query builder.
     * 
     * @param {Expression} expression - The expression builder instance to use.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    setExpression(expression: IEloquentExpression): IEloquent<Model> {
        this.expression = expression
        return this as unknown as IEloquent<Model>
    }

    /**
     * Sets the expression builder to use for the query builder.
     * 
     * @param {ICtor<IEloquentExpression>} builderCtor The constructor of the expression builder to use.
     * @returns {this} The query builder instance for chaining.
     */
    setExpressionCtor(builderCtor: ICtor<IEloquentExpression>): IEloquent<Model> {
        this.expressionCtor = builderCtor;
        this.expression = new builderCtor();
        return this as unknown as IEloquent<Model>
    }

    /**
     * Resets the expression builder to its default state.
     * 
     * This method is a convenience wrapper around the expression builder's
     * `reset` method.
     * 
     * @returns {IEloquentExpression} The expression builder instance after resetting.
     */
    resetExpression(): IEloquent<Model> {
        const tableName = this.expression.getTable();
        this.expression = new this.expressionCtor();
        this.setTable(tableName)
        return this as unknown as IEloquent<Model>
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
    setModelCtor(modelCtor?: ICtor<IModel>): IEloquent<Model> {
        this.modelCtor = modelCtor
        return this as unknown as IEloquent<Model>
    }

    /**
     * Sets the columns for the query builder based on the fields of the associated model.
     * 
     * This method initializes an instance of the model using its constructor,
     * retrieves the fields of the model, and sets each field as a column in the query builder.
     * 
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    setModelColumns(modelCtor?: ICtor<IModel>, options: SetModelColumnsOptions = {}): IEloquent<Model> {
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
        
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds the id: uuid to the document
     * @param document The document to add an id to
     * @returns The document with an id added
     */
    protected documentWithGeneratedId<T>(document: T): T {
        return this.documentStripUndefinedProperties({
            ...document,
            id: this.generateId() ?? undefined
        }) 
    }

    /**
     * Removes undefined properties from the document
     * @param document The document to clean
     * @returns The cleaned document
     */
    protected documentStripUndefinedProperties<T>(document: T): T {
        for (const key in document) {
            if (document[key] === undefined) {
                delete document[key]
            }
        }
        return document
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
     * Fetches rows from the database based on the provided expression and arguments.
     * 
     * @param expression 
     * @param args 
     */
     
    abstract fetchRows<T = unknown>(expression: IEloquentExpression, ...args: any[]): Promise<T>;

    /**
     * Sets the formatter function for the query builder. This function will be
     * called with each row of the result as an argument. The function should
     * return the transformed row.
     *
     * @param {TFomatterFn} formatterFn The formatter function to set
     * @returns {this} The query builder instance to enable chaining
     */
    setFormatter(formatterFn?: TFormatterFn): IEloquent<Model> {
        this.formatterFn = formatterFn 
        return this as unknown as IEloquent<Model>
    }

    /**
     * Sets the ID generator function for the query builder.
     *
     * This function will be used to generate unique IDs for new records
     * when inserting them into the database.
     *
     * @param {IdGeneratorFn} idGeneratorFn - The ID generator function to set.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    setIdGenerator(idGeneratorFn?: IdGeneratorFn): IEloquent<Model> {
        this.idGeneratorFn = idGeneratorFn
        return this as unknown as IEloquent<Model>
    }

    /**
     * Retrieves the current ID generator function for the query builder.
     *
     * @returns {IdGeneratorFn} The ID generator function.
     */
    getIdGenerator(): IdGeneratorFn | undefined {
        return this.idGeneratorFn
    }

    /**
     * Generates a unique ID for a new record using the current ID generator
     * function.
     *
     * @returns {T | null} The generated ID or null if no ID generator
     * function is set.
     */
    generateId<T = unknown>(): T | null {
        return this.idGeneratorFn ? this.idGeneratorFn() : null
    }

    /**
     * Sets the table name to use for the query builder.
     * 
     * This is a convenience method for {@link setTable}.
     * 
     * @param {string} tableName The table name to set.
     * @returns {this} The query builder instance for chaining.
     */
    setTable(tableName: string): IEloquent<Model> {
        this.expression.setTable(tableName);
        return this as unknown as IEloquent<Model>
    }
    
    /**
     * Retrieves the table name associated with the query builder, or throws an
     * exception if it is not set.
     * 
     * @returns {string} The table name
     * @throws {MissingTableException} If the table name is not set
     */
    useTable(): string {
        const tableName = this.expression.getTable();
        if(!tableName || tableName?.length === 0) {
            throw new MissingTableException()
        }
        return tableName
    }
    
    /**
     * Sets the connection name to use for the query builder
     * @param {string} connectionName The connection name to use
     */
    setConnectionName(connectionName: string): IEloquent<Model> {
        this.connectionName = connectionName
        return this as unknown as IEloquent<Model>;
    }

    /**
     * Sets the columns to select for the query builder.
     * @param {string|string[]} [columns='*'] The columns to set for selection.
     * @returns {IEloquent<Model>} The query builder instance.
     */
    select(columns?: string | string[]): IEloquent<Model> {

        this.setColumns([]);

        if(columns === undefined) {
            return this as unknown as IEloquent<Model>;
        }

        const columnsArray = Array.isArray(columns) ? columns : [columns]

        if(columnsArray.length === 0) {
            throw new EloquentException('Expected at least one column');
        }

        columnsArray.forEach(column => {
            this.column(column)
        })

        return this as unknown as IEloquent<Model>;
    }

    /**
     * Adds a column to the columns array to be included in the SQL query.
     * If the column is already in the array, it will not be added again.
     * @param {string | TColumnOption} column The column name to add to the array.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    column(column: TColumnOption | string): IEloquent<Model> {
        if(typeof column === 'string') {
            column = {column}
        }

        // if no table name is set, use the current table
        if(!column.tableName) {
            column.tableName = this.useTable();
        }
        
        this.expression.addColumn(column);
        return this as unknown as IEloquent<Model>
    }

    /**
     * Sets a raw select expression for the query builder.
     * 
     * This method can be used to set a custom select expression on the query builder.
     * The expression will be used as the SELECT clause for the query.
     * 
     * @param {string} expression - The raw select expression to set.
     * @param {unknown[]} [bindings] - The bindings to use for the expression.
     * @returns {IEloquent<Attributes, IEloquentExpression<unknown>>} The query builder instance.
     */
    selectRaw(expression: string, bindings?: unknown[]): IEloquent<Model> {
        this.expression.setSelectRaw(expression, bindings);
        return this as unknown as IEloquent<Model>
    }

    /**
     * Sets the distinct columns for the query builder
     * @param {string|string[]} columns The columns to set for distinct
     * @returns {IEloquent<Model>} The query builder instance
     */
    distinct(columns: string | string[]): IEloquent<Model> {
        columns = Array.isArray(columns) ? columns : [columns];
        const columnsTyped = columns.map(column => ({column})) as TColumnOption[]
        
        this.expression.setDistinctColumns(columnsTyped);
        return this as unknown as IEloquent<Model>;
    }
    
    /**
     * Clones the query builder instance.
     *
     * The cloned instance will have the same model constructor associated with it.
     * @returns {IEloquent} The cloned query builder instance
     */
    clone(): IEloquent<Model> {
        return deepClone<IEloquent<Model>>(this as unknown as IEloquent<Model>)
            .setExpression(this.expression.clone())
    }

     
    async createDatabase(name: string): Promise<void> {
        throw new InvalidMethodException()
    }

     
    async databaseExists(name: string): Promise<boolean> {
        throw new InvalidMethodException()
    }

     
    async dropDatabase(name: string): Promise<void> {
        throw new InvalidMethodException()
    }

     
    async createTable(name: string, ...args: any[]): Promise<void> {
        throw new InvalidMethodException()
    }

     
    async dropTable(name: string, ...args: any[]): Promise<void> {
        throw new InvalidMethodException()
    }

     
    async tableExists(name: string): Promise<boolean> {
        throw new InvalidMethodException()
    }

     
    async alterTable(name: string, ...args: any[]): Promise<void> {
        throw new InvalidMethodException()
    }

    async dropAllTables(): Promise<void> {
        throw new InvalidMethodException()
    }

     
    async execute<T>(builder: IEloquentExpression): Promise<T> {
        throw new InvalidMethodException()
    }

     
    async raw<T>(expression: string, bindings?: unknown[]): Promise<T> {
        throw new InvalidMethodException()
    }

     
    async find(id: string | number): Promise<Model | null> {
        throw new InvalidMethodException()
    }

     
    async findOrFail(id: string | number): Promise<Model> {
        throw new InvalidMethodException()
    }

    async get(): Promise<Collection<Model>> {
        throw new InvalidMethodException()
    }

    async all(): Promise<Collection<Model>> {
        throw new InvalidMethodException()
    }

    async first(): Promise<Model | null> {
        throw new InvalidMethodException()
    }

    async firstOrFail(): Promise<Model> {
        throw new InvalidMethodException()
    }

    async last(): Promise<Model | null> {
        throw new InvalidMethodException()
    }

    async lastOrFail(): Promise<Model> {
        throw new InvalidMethodException()
    }

     
    async insert(documents: object | object[]): Promise<Collection<Model>> {
        throw new InvalidMethodException()
    }

     
    async update(documents: object | object[]): Promise<Collection<Model>> {
        throw new InvalidMethodException()
    }

     
    async updateAll(documents: object | object[]): Promise<Collection<Model>> {
        throw new InvalidMethodException()
    }

    /**
     * Sets the group by columns for the query builder.
     *
     * @param {...string} columns - The columns to group by.
     * @returns {this} The query builder instance for chaining.
     */
    groupBy(columns: string[] | string | null): IEloquent<Model> {

        if(!columns) {
            this.expression.setGroupBy(null);
            return this as unknown as IEloquent<Model>
        }

        const columnsArray = Array.isArray(columns) ? columns : [columns]
        const groupBy = columns ? columnsArray.map(column => ({column, tableName: this.useTable()})) as TGroupBy[] : null
        
        this.expression.setGroupBy(groupBy);
        return this as unknown as IEloquent<Model>
    }

    async count(): Promise<number> {
        throw new InvalidMethodException()
    }

    async max(column: string): Promise<number> {
        throw new InvalidMethodException()
    }

    async min(column: string): Promise<number> {
        throw new InvalidMethodException()
    }

    async sum(column: string): Promise<number> {
        throw new InvalidMethodException()
    }

    async avg(column: string): Promise<number> {
        throw new InvalidMethodException()
    }

    async transaction(callbackFn: TransactionFn): Promise<void> {
        throw new InvalidMethodException()
    }

    /**
     * Adds a where clause to the query builder.
     *
     * @param {string} column - The column to apply the where condition on.
     * @param {TOperator} [operator] - The operator to use for comparison.
     * @param {TWhereClauseValue} [value] - The value to compare against.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     * @throws {QueryBuilderException} If an invalid or missing operator is provided.
     */
    where(column: string, operator?: TOperator, value?: TWhereClauseValue, logicalOperator: TLogicalOperator = LogicalOperators.AND): IEloquent<Model> {

        // Handle default equals case
        if(value === undefined) {
            this.expression.where(column, '=', operator as TWhereClauseValue, logicalOperator);
            return this as unknown as IEloquent<Model>
        }

        // Check operator has been provided and matches expected value
        if(operator === undefined || OperatorArray.includes(operator) === false) {
            throw new QueryBuilderException('Operator is required')
        }

        this.expression.addWhere({
            column,
            operator,
            value,
            logicalOperator,
            tableName: this.useTable()
        })
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds a raw where clause to the query builder.
     *
     * @param {Q} sql - The raw SQL to use for the where clause.
     * @param {Bindings} [bindings] - The bindings to use for the where clause.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    whereRaw<Q = string, Bindings = unknown>(sql: Q, bindings?: Bindings): IEloquent<Model> {
        this.expression.whereRaw(sql as string, bindings);
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds an or where clause to the query builder.
     *
     * @param {string} column - The column to apply the where condition on.
     * @param {TOperator} [operator] - The operator to use for comparison.
     * @param {TWhereClauseValue} [value] - The value to compare against.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     * @throws {QueryBuilderException} If an invalid or missing operator is provided.
     */
    orWhere(column: string, operator?: TOperator, value?: TWhereClauseValue): IEloquent<Model> {
        return this.where(column, operator, value, LogicalOperators.OR)
    }


    /**
     * Adds a where in clause to the query builder.
     * 
     * @param {string} column - The column to apply the where in condition on.
     * @param {TWhereClauseValue[]} values - An array of values to compare against.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    whereIn(column: string, values: TWhereClauseValue[]): IEloquent<Model> {
        this.expression.addWhere({column, operator: 'in', value: values, tableName: this.useTable()});
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds a where not in clause to the query builder.
     * 
     * This method allows for filtering the query results by excluding rows
     * where the specified column's value is within the given array of values.
     * 
     * @param {string} column - The column to apply the where not in condition on.
     * @param {TWhereClauseValue[]} values - An array of values to exclude.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    whereNotIn(column: string, values: any[]): IEloquent<Model> {
        this.expression.addWhere({column, operator: 'not in', value: values, tableName: this.useTable()});
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds a where null clause to the query builder.
     * 
     * @param {string} column - The column to apply the where null condition on.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    whereNull(column: string): IEloquent<Model> {
        this.expression.addWhere({column, operator: 'is null', value: null, tableName: this.useTable()});
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds a where not null clause to the query builder.
     * 
     * This method allows for filtering the query results by including only rows
     * where the specified column's value is not null.
     * 
     * @param {string} column - The column to apply the where not null condition on.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    whereNotNull(column: string): IEloquent<Model> {
        this.expression.addWhere({column, operator: 'is not null', value: null, tableName: this.useTable()});
        return this as unknown as IEloquent<Model>
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
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    whereBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IEloquent<Model> {
        this.expression.addWhere({column, operator: 'between', value: range, tableName: this.useTable()});
        return this as unknown as IEloquent<Model>
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
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    whereNotBetween(column: string, range: [TWhereClauseValue, TWhereClauseValue]): IEloquent<Model> {
        this.expression.addWhere({column, operator: 'not between', value: range, tableName: this.useTable()});
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds a where like clause to the query builder.
     * 
     * This method allows for filtering the query results by including only rows
     * where the specified column's value matches the given value using the LIKE operator.
     * 
     * @param {string} column - The column to apply the where like condition on.
     * @param {TWhereClauseValue} value - The value to compare against.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    whereLike(column: string, value: TWhereClauseValue): IEloquent<Model> {
        this.expression.addWhere({column, operator: 'like', value, tableName: this.useTable()});
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds a where not like clause to the query builder.
     * 
     * This method allows for filtering the query results by excluding rows
     * where the specified column's value does not match the given value using the NOT LIKE operator.
     * 
     * @param {string} column - The column to apply the where not like condition on.
     * @param {TWhereClauseValue} value - The value to compare against.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    whereNotLike(column: string, value: TWhereClauseValue): IEloquent<Model> {
        this.expression.addWhere({column, operator: 'not like', value, tableName: this.useTable()});
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds a relationship to the query builder.
     * 
     * This method allows for loading the related data of the model being queried.
     * 
     * @param {string} relationship - The name of the relationship to load.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    with(relationship: string): IEloquent<Model> { 
        if(!this.modelCtor) {
            throw new ExpressionException('Model constructor has not been set');
        }
        
        return new With(this as unknown as IEloquent, relationship).updateEloquent() as unknown as IEloquent<Model>
    }

    /**
     * Adds an inner join to the query builder.
     * 
     * @param {string} table - The table to join.
     * @param {string} relatedTable - The table to join with.
     * @param {string} localColumn - The column to join on in the left table.
     * @param {string} relatedColumn - The column to join on in the right table.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    join(relatedTable: string, localColumn: string, relatedColumn: string ): IEloquent<Model> {
        const localTable = this.useTable()
        this.expression.setJoins({ localTable, localColumn, relatedTable, relatedColumn, type: 'inner' });
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds a left join to the query builder.
     * 
     * @param {string} relatedTable - The table to join with.
     * @param {string} localColumn - The column to join on in the left table.
     * @param {string} relatedColumn - The column to join on in the right table.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    leftJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model> {
        const localTable = this.useTable()
        this.expression.setJoins({ localTable, localColumn, relatedTable, relatedColumn, type: 'left' });
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds a right join to the query builder.
     * 
     * @param {string} relatedTable - The table to join with.
     * @param {string} localColumn - The column to join on in the left table.
     * @param {string} relatedColumn - The column to join on in the right table.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    rightJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model> {
        const localTable = this.useTable()
        this.expression.setJoins({ localTable, localColumn, relatedTable, relatedColumn, type: 'right' });
        return this as unknown as IEloquent<Model>
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
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    fullJoin(relatedTable: string, localColumn: string, relatedColumn: string): IEloquent<Model> {
        const localTable = this.useTable()
        this.expression.setJoins({ localTable, localColumn, relatedTable, relatedColumn, type: 'full' });
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds a cross join to the query builder.
     * 
     * @param {string} relatedTable - The table to join with.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    crossJoin(relatedTable: string) {
        this.expression.setJoins({ relatedTable, type: 'cross' });
        return this as unknown as IEloquent<Model>
    }

    /**
     * Adds an order by clause to the query builder.
     * `
     * @param {string} column - The column to order by.
     * @param {TDirection} direction - The direction to order by. Defaults to 'asc'.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    orderBy(column: string | null, direction: TDirection = 'asc'): IEloquent<Model> {
        if(column === null) {
            this.expression.setOrderBy(null);
            return this as unknown as IEloquent<Model>
        }
        this.expression.orderBy({ column, direction });
        return this as unknown as IEloquent<Model>
    }

    /**
     * Orders the query builder by the given column in descending order.
     * 
     * This method is an alias for orderBy(column, 'desc').
     * 
     * @param {string} column - The column to order by.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    latest(column: string): IEloquent<Model> {
        this.expression.orderBy({ column, direction: Direction.DESC});
        return this as unknown as IEloquent<Model>
    }

    /**
     * Orders the query builder by the given column in descending order.
     * 
     * This method is an alias for orderBy(column, 'desc').
     * 
     * @param {string} column - The column to order by.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    newest(column: string): IEloquent<Model> {
        return this.latest(column)
    }

    /**
     * Orders the query builder by the given column in ascending order.
     * 
     * This method is an alias for orderBy(column, 'asc').
     * 
     * @param {string} column - The column to order by.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    oldest(column: string): IEloquent<Model> {
        return this.orderBy(column, Direction.ASC)
    }


    /**
     * Sets the offset for the query builder.
     * 
     * @param {number} offset - The value of the offset to set.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    offset(offset: number | null): IEloquent<Model> {
        this.expression.setOffset(offset);
        return this as unknown as IEloquent<Model>
    }
    
    /**
     * Sets the offset for the query builder.
     * 
     * This method is an alias for the `offset` method.
     * 
     * @param {number} skip - The value of the offset to set.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    skip(skip: number | null): IEloquent<Model> {
        return this.offset(skip)
    }

    /**
     * Sets the limit clause for the query builder.
     * 
     * @param {number} limit - The limit clause to set.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    limit(limit: number | null): IEloquent<Model> {
        this.expression.setLimit(limit);
        return this as unknown as IEloquent<Model>      
    }

    /**
     * Sets the limit clause for the query builder.
     * 
     * This method is an alias for the `limit` method.
     * 
     * @param {number} take - The limit clause to set.
     * @returns {IEloquent<Model>} The query builder instance for chaining.
     */
    take(take: number | null): IEloquent<Model> {
        return this.limit(take)
    }

    /**
     * Deletes records from the database based on the current query builder state.
     * 
     * @returns {Promise<Collection<Model>>} A promise that resolves to a collection of the deleted models.
     * 
     * @throws {Error} Throws an error if the method is not implemented.
     */
    delete(): Promise<IEloquent<Model>> {
        throw new Error("Method not implemented.");
    }
    
}

export default Eloquent