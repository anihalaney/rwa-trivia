module.exports = {
    setupFiles: ["jest-canvas-mock"],
    collectCoverage: true,
    coverageReporters: ['html', 'text-summary'],
    moduleNameMapper: {
        '^shared-library/(.*)$': '<rootDir>/projects/shared-library/src/lib/$1',
        '^test/(.*)$': '<rootDir>/test/$1',

    },
    testPathIgnorePatterns: ['/node_modules/', '/integration/'],
  };

