module.exports = {
    coverageReporters: ['html'],
    moduleNameMapper: {
        "^shared-library/(.*)$": "<rootDir>/projects/shared-library/src/lib/$1"
    },
    testPathIgnorePatterns: ['/node_modules/', '/integration/'],
  };

