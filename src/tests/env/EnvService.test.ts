import { describe } from '@jest/globals';
import EnvService from '@src/core/domains/console/service/EnvService';
import fs from 'fs';
import path from 'path';

describe('test EnvService methods', () => {

    const service = new EnvService();
    const fakeEnvPath = path.resolve('@src/../', '.env.test');

    /**
     * Copy .env.example to .env.test
     */
    beforeAll(async () => {
        service.copyFileFromEnvExample(service.envExamplePath, fakeEnvPath);
        expect(await service.readFileContents(fakeEnvPath)).toBeTruthy();
    })

    /**
     * Clean up test .env.test
     */
    afterAll(async () => {
        fs.unlinkSync(fakeEnvPath);
        expect(fs.existsSync(fakeEnvPath)).toBe(false);
    })

    /**
     * Check if .env.example exists and get content
     */
    test('test get .env.example content', async () => {
        const envContent = await service.readFileContents(service.envExamplePath);
        expect(envContent).toBeTruthy();
    })

    /**
     * Check if .env.test exists and get content
     */
    test('test get .env.test content', async () => {
        const envContent = await service.readFileContents(fakeEnvPath);
        expect(envContent).toBeTruthy();
    })

    /**
     * Update .env.test properties
     */
    test('update .env properties', async () => {
        await service.updateValues({
            JWT_SECRET: 'test'
        }, fakeEnvPath);

        const envContent = await service.readFileContents(fakeEnvPath);
        expect(envContent).toContain('JWT_SECRET=test');
    });
});