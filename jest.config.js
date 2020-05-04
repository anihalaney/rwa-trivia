module.exports = {
    coverageReporters: ['html', 'text-summary'],
    moduleNameMapper: {
        "^shared-library/(.*)$": "<rootDir>/projects/shared-library/src/lib/$1"
    },
    testPathIgnorePatterns: ['/node_modules/', '/integration/'],
    collectCoverage: true,
    coverageDirectory: "<rootDir>/coverage",
  };

