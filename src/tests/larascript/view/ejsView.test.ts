 
import { beforeAll, describe, expect, test } from '@jest/globals';
import { AppSingleton } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

describe('can generate ejs view', () => {

    beforeAll(async () => {
        // Boot the test application with view provider
        await testHelper.testBootApp();
    });

    test('can generate a view with request data', async () => {
        // Arrange - Prepare test data similar to tinker.ts example
        const testData = {
            title: 'WELCOME TEST',
            requestId: 'UNIQUE_REQUEST_ID'
        };

        // Act - Render the view using the same pattern as tinker.ts
        const renderedHtml = await AppSingleton.container('view').ejs().render({
            view: 'welcome',
            data: testData,
            layout: 'base-view'
        });

        // Assert - Verify the rendered HTML contains expected content
        expect(renderedHtml).toBeDefined();
        expect(typeof renderedHtml).toBe('string');
        expect(renderedHtml.length).toBeGreaterThan(0);
        
        // Check that the title is rendered
        expect(renderedHtml).toContain('WELCOME TEST');
        
        // Check that the requestId is rendered
        expect(renderedHtml).toContain('UNIQUE_REQUEST_ID');
        
        // Check that it's a complete HTML document with layout
        expect(renderedHtml).toContain('<!DOCTYPE html>');
        expect(renderedHtml).toContain('<html');
        expect(renderedHtml).toContain('</html>');
        
        // Check for specific welcome page content
        expect(renderedHtml).toContain('Welcome to Larascript Framework');
        expect(renderedHtml).toContain('Request ID:');
    });

    test('can generate a view with empty data', async () => {
        // Act - Render with minimal data
        const renderedHtml = await AppSingleton.container('view').ejs().render({
            view: 'welcome',
            data: {},
            layout: 'base-view'
        });

        // Assert
        expect(renderedHtml).toBeDefined();
        expect(typeof renderedHtml).toBe('string');
        expect(renderedHtml.length).toBeGreaterThan(0);
        
        // Should still contain the basic welcome content
        expect(renderedHtml).toContain('Welcome to Larascript Framework');
        
        // Should handle undefined variables gracefully
        expect(renderedHtml).toContain('Request ID: ');
    });

    test('throws error for non-existent view', async () => {
        // Act & Assert - Should throw an error for non-existent view
        await expect(
            AppSingleton.container('view').ejs().render({
                view: 'non-existent-view',
                data: {},
                layout: 'base-view'
            })
        ).rejects.toThrow();
    });
});