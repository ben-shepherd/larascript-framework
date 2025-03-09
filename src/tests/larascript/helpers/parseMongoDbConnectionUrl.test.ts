import { describe, expect, test } from '@jest/globals';
import ParseMongoDBConnectionString from '@src/core/domains/mongodb/helper/ParseMongoDBConnectionUrl';

describe('MongoDB Connection String Parser', () => {
    test('parses a basic connection string without authentication', () => {
        const connectionString = 'mongodb://localhost:27017/testdb';
        const parsed = ParseMongoDBConnectionString.parse(connectionString);
        
        expect(parsed.getHost()).toBe('localhost');
        expect(parsed.getPort()).toBe(27017);
        expect(parsed.getDatabase()).toBe('testdb');
        expect(parsed.getUsername()).toBeUndefined();
        expect(parsed.getPassword()).toBeUndefined();
        expect(parsed.getOptions().size).toBe(0);
    });

    test('parses a connection string with authentication', () => {
        const connectionString = 'mongodb://myuser:mypassword@localhost:27017/testdb';
        const parsed = ParseMongoDBConnectionString.parse(connectionString);
        
        expect(parsed.getHost()).toBe('localhost');
        expect(parsed.getPort()).toBe(27017);
        expect(parsed.getDatabase()).toBe('testdb');
        expect(parsed.getUsername()).toBe('myuser');
        expect(parsed.getPassword()).toBe('mypassword');
    });

    test('parses a connection string with query parameters', () => {
        const connectionString = 'mongodb://localhost:27017/testdb?retryWrites=true&w=majority';
        const parsed = ParseMongoDBConnectionString.parse(connectionString);
        
        expect(parsed.getHost()).toBe('localhost');
        expect(parsed.getPort()).toBe(27017);
        expect(parsed.getDatabase()).toBe('testdb');
        expect(parsed.getOptions()).toEqual(new Map([
            ['retryWrites', 'true'],
            ['w', 'majority']
        ]));
    });

    test('parses a connection string with special characters', () => {
        const connectionString = 'mongodb://user%40example.com:pass%23word@localhost:27017/testdb';
        const parsed = ParseMongoDBConnectionString.parse(connectionString);
        
        expect(parsed.getUsername()).toBe('user@example.com');
        expect(parsed.getPassword()).toBe('pass#word');
    });

    test('parses a mongodb+srv connection string', () => {
        const connectionString = 'mongodb+srv://user:pass@cluster0.example.mongodb.net/testdb';
        const parsed = ParseMongoDBConnectionString.parse(connectionString);
        
        expect(parsed.getProtocol()).toBe('mongodb+srv');
        expect(parsed.getHost()).toBe('cluster0.example.mongodb.net');
        expect(parsed.getUsername()).toBe('user');
        expect(parsed.getPassword()).toBe('pass');
        expect(parsed.getDatabase()).toBe('testdb');
    });

    test('uses default port when not specified', () => {
        const connectionString = 'mongodb://localhost/testdb';
        const parsed = ParseMongoDBConnectionString.parse(connectionString);
        
        expect(parsed.getPort()).toBe(27017);
    });

    test('toString() reconstructs the original connection string', () => {
        const originalString = 'mongodb://myuser:mypassword@localhost:27017/testdb?retryWrites=true&w=majority';
        const parsed = ParseMongoDBConnectionString.parse(originalString);
        const reconstructed = parsed.toString();
        
        // Parse both strings again to compare their components (since query params might be in different order)
        const originalParsed = ParseMongoDBConnectionString.parse(originalString);
        const reconstructedParsed = ParseMongoDBConnectionString.parse(reconstructed);
        
        expect(reconstructedParsed.getHost()).toBe(originalParsed.getHost());
        expect(reconstructedParsed.getPort()).toBe(originalParsed.getPort());
        expect(reconstructedParsed.getUsername()).toBe(originalParsed.getUsername());
        expect(reconstructedParsed.getPassword()).toBe(originalParsed.getPassword());
        expect(reconstructedParsed.getDatabase()).toBe(originalParsed.getDatabase());
        expect(reconstructedParsed.getOptions()).toEqual(originalParsed.getOptions());
    });

    test('throws error for invalid connection string', () => {
        const invalidString = 'invalid://localhost:27017';
        expect(() => {
            ParseMongoDBConnectionString.parse(invalidString);
        }).toThrow('Invalid MongoDB connection string format');
    });

    test('handles connection string without database', () => {
        const connectionString = 'mongodb://localhost:27017';
        const parsed = ParseMongoDBConnectionString.parse(connectionString);
        
        expect(parsed.getDatabase()).toBeUndefined();
    });

    test('constructs instance with direct parameters', () => {
        const connection = new ParseMongoDBConnectionString({
            host: 'localhost',
            port: 27017,
            username: 'user',
            password: 'pass',
            database: 'testdb',
            options: new Map([['retryWrites', 'true']])
        });
        
        expect(connection.getHost()).toBe('localhost');
        expect(connection.getPort()).toBe(27017);
        expect(connection.getUsername()).toBe('user');
        expect(connection.getPassword()).toBe('pass');
        expect(connection.getDatabase()).toBe('testdb');
        expect(connection.getOptions().get('retryWrites')).toBe('true');
    });
});