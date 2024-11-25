export type TMapCallback<T,V> = (value: T, index: number, array: T[]) => V;

export type TForeachCallback<T> = (value: T, index: number, array: T[]) => void;

export type TOperator = "===" | "==" | "!==" | "!=" | "<>" | ">" | "<" | ">=" | "<="