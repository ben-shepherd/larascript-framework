import ExpressionException from "@src/core/domains/eloquent/exceptions/ExpressionException";
import { LogicalOperators, TLogicalOperator, TWhereClause } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { z } from "zod";

import { MongoRaw } from ".";

class Match {


    /**
     * Builds a MongoDB aggregation pipeline match stage from SQL-style where clauses.
     * 
     * @param whereClauses - Array of where clause conditions with column, operator, and value
     * @param whereRaw - Optional raw MongoDB query object to use instead of building from where clauses
     * @returns A MongoDB $match pipeline stage object, or null if no conditions provided
     * @example
     * 
     * // Basic usage with where clauses
     * Match.getPipeline([
     *   { column: 'age', operator: '>', value: 21 }
     * ], null);
     * // Returns: { $match: { $and: [{ age: { $gt: 21 } }] } }
     * 
     * // Using raw MongoDB query
     * Match.getPipeline(null, { age: { $gt: 21 } });
     * // Returns: { $match: { age: { $gt: 21 } } }
     */
    static getPipeline(whereClauses: TWhereClause[] | null, whereRaw: MongoRaw | null): object | null {

        if(!whereClauses && !whereRaw) return null;

        if(whereRaw) {
            return { $match: whereRaw };
        }

        return { $match: this.buildWherePipeline(whereClauses as TWhereClause[]) };
    }

    /**
     * Builds a MongoDB pipeline for a where clause.
     * 
     * Takes an array of where clauses and converts them into a MongoDB pipeline format.
     * Handles logical operators (AND/OR) between clauses and maps SQL-style operators 
     * to their MongoDB equivalents.
     * 
     * @param whereClauses - Array of where clauses to convert to MongoDB format
     * @returns A MongoDB pipeline object representing the where conditions
     * @protected
     * @example
     * ```typescript
     * const pipeline = Match.buildWherePipeline([
     *   { column: 'age', operator: '>', value: 21 },
     *   { column: 'status', operator: '=', value: 'active', logicalOperator: 'OR' }
     * ]);
     * ```
     */
    protected static buildWherePipeline(whereClauses: TWhereClause[]): object {
        if (whereClauses.length === 0) return {};

        const result: { $and: object[] } = { $and: [] }
        const conditions: object[] = [];

        for (let i = 0; i < whereClauses.length; i++) {
            // Get the current where clause
            const currentWhere = whereClauses[i];

            // Build the where filter object
            const currentWhereFilterObject = this.buildWhereFilterObject(currentWhere);

            // Get the current logical operator
            const currentLogicalOperator = currentWhere.logicalOperator ?? LogicalOperators.AND;

            // Normalize the logical operator
            const currentLogicalOperatorNormalized = this.normalizeLogicalOperator(currentLogicalOperator);

            // Get the previous where clause
            const previousWhere = whereClauses[i - 1] ?? null

            // Get the previous logical operator
            const previousLogicalOperator = previousWhere?.logicalOperator ?? LogicalOperators.AND;

            // Check if the current logical operator matches the previous logical operator
            const currentLogicalOperatorMatchPrevious = previousLogicalOperator === currentLogicalOperator

            // If the current logical operator matches the previous logical operator, add the current where filter object to the last condition
            if(currentLogicalOperatorMatchPrevious) {
                const lastConditionIndex = conditions.length - 1
                const lastCondition = conditions[lastConditionIndex] ?? null

                if(lastCondition) { 
                    conditions[lastConditionIndex][currentLogicalOperatorNormalized] = [
                        ...lastCondition[currentLogicalOperatorNormalized],
                        currentWhereFilterObject
                    ]
                    continue;
                }
            }

            // Add the current where filter object to the conditions array
            conditions.push({
                [currentLogicalOperatorNormalized]: [currentWhereFilterObject]
            })
        }

        // If we only have one condition group, return it directly
        if (conditions.length === 1) {
            return conditions[0];
        }

        // Add the conditions to the result
        result.$and = conditions

        return result
    }

    /**
     * Builds a MongoDB where clause for a single condition.
     * 
     * Takes a where clause object and converts it to MongoDB query syntax.
     * Maps SQL-style operators (=, !=, >, <, etc.) to their MongoDB equivalents ($eq, $ne, $gt, $lt, etc.).
     * Handles special cases like BETWEEN, NOT BETWEEN, LIKE, etc.
     *
     * @param whereClause - The where clause object containing column, operator and value
     * @returns A MongoDB query object representing the where condition
     * @protected
     * @throws {ExpressionException} When an invalid operator is provided
     * @example
     * ```typescript
     * const clause = Match.buildWhereClause({
     *   column: 'age',
     *   operator: '>',
     *   value: 21
     * });
     * // Returns: { age: { $gt: 21 } }
     * ```
     */
    protected static buildWhereFilterObject(whereClause: TWhereClause): object {
        const { column, operator, value } = whereClause

        switch(operator) {

        case "=":
            return { [column]: value }
        case "!=":
            return { [column]: { $ne: value } }
        case "<>":
            return { [column]: { $ne: value } }
        case ">":
            return { [column]: { $gt: value } }
        case "<":
            return { [column]: { $lt: value } }
        case ">=":
            return { [column]: { $gte: value } }
        case "<=":
            return { [column]: { $lte: value } }
        case "like":
            return { [column]: { $regex: value, $options: 'i' } }
        case "not like":
            return { [column]: { $not: { $regex: value, $options: 'i' } } }
        case "in":
            return { [column]: { $in: value } }
        case "not in":
            return { [column]: { $not: { $in: value } } }
        case "is null":
            return { [column]: { $eq: null } }
        case "is not null":
            return { [column]: { $ne: null } }
        case "between":
            return this.between(column, value)
        case "not between":
            return this.notBetween(column, value)
        }

    }

    /**
     * Builds a MongoDB BETWEEN clause for a column and value range.
     * 
     * @param column - The column/field name to apply the BETWEEN condition to
     * @param value - Array containing the lower and upper bounds [min, max]
     * @returns MongoDB query object for BETWEEN condition
     * @protected
     * @throws {ExpressionException} When value is not an array of two numbers/dates
     */
    protected static between(column: string, value: TWhereClause['value']) {
        this.validateBetweenValue(value)
        const betweenValue = value as [number, number]
        return { [column]: { $gte: betweenValue[0], $lte: betweenValue[1] } }
    }

    /**
     * Builds a MongoDB NOT BETWEEN clause for a column and value range.
     * 
     * @param column - The column/field name to apply the NOT BETWEEN condition to
     * @param value - Array containing the lower and upper bounds [min, max]
     * @returns MongoDB query object for NOT BETWEEN condition
     * @protected
     * @throws {ExpressionException} When value is not an array of two numbers/dates
     */
    protected static notBetween(column: string, value: TWhereClause['value']) {
        this.validateBetweenValue(value)
        const betweenValue = value as [number, number]
        return { [column]: { $not: { $gte: betweenValue[0], $lte: betweenValue[1] } } }
    }

    /**
     * Normalizes the logical operator to the MongoDB format.
     * 
     * @param operator - The logical operator to normalize
     * @returns The normalized logical operator
     * @protected
     */
    protected static normalizeLogicalOperator(operator: TLogicalOperator): string {
        return operator === LogicalOperators.OR ? '$or' : '$and'
    }

    /**
     * Validates that a BETWEEN/NOT BETWEEN value is an array of two numbers or dates.
     * 
     * @param value - The value to validate
     * @returns false if validation passes
     * @protected
     * @throws {ExpressionException} When validation fails
     */
    protected static validateBetweenValue(value: TWhereClause['value']) {
        
        const schema = z.array(z.union([z.date(), z.number()]))
        const result = schema.safeParse(value)

        if(!result.success) {
            throw new ExpressionException('Between value must be a date or number')
        }

        if((value as any[]).length !== 2) {
            throw new ExpressionException('Between value expected 2 values')
        }

        return false
    }

}

export default Match