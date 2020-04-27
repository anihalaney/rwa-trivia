module.exports = {
    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageReporters: ['html'],
    moduleNameMapper: {
        "^shared-library/(.*)$": "<rootDir>/projects/shared-library/src/lib/$1"
    },
    testPathIgnorePatterns: ['/node_modules/', '/integration/'],
  };

