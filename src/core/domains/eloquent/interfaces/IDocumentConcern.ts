export interface IDocumentConern {
    documentWithUuid<T>(document: T): T;
    documentStripUndefinedProperties<T>(document: T): T;
}