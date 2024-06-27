const tsConfigPaths = require('tsconfig-paths');

const cleanup = tsConfigPaths.register({
  baseUrl: './',
  paths: {
    "@src/*": ["./dist/*"],  // Adjust according to actual output in `dist` if necessary
    "@config/*": ["./dist/config/*"]
  }
});

// Optional: Cleanup if needed later
// cleanup();
