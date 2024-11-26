
export type TColumns = string[]

export type TOperator = "=" | "!=" | "<>" | ">" | "<" | ">=" | "<="

export type TWhereClause = {
    column: string,
    operator: TOperator,
    value: string | number | boolean | null 
}

export type TDirection = "asc" | "desc"

export type TOrderBy = {
    column: string,
    order: TDirection
}