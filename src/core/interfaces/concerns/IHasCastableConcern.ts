/* eslint-disable no-unused-vars */
export type TCastableType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'array' 
  | 'object' 
  | 'date' 
  | 'integer'
  | 'float'
  | 'bigint'
  | 'null'
  | 'undefined'
  | 'symbol'
  | 'map'
  | 'set';
  
export interface IHasCastableConcern {
    cast<T = unknown>(data: unknown, type: TCastableType): T;
    isValidType(type: TCastableType): boolean;
}