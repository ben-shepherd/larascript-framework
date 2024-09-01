export interface IMigration {
    up(): Promise<void>
    down(): Promise<void>
}