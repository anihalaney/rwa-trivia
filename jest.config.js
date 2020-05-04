module.exports = {
    collectCoverage: true,
    coverageReporters: ['html', 'text-summary'],
    coverageDirectory: '<rootDir>/test/coverage',
    reporters: ['default', ['jest-stare', {
        "resultDir": "test/result",
        "coverageLink": "../coverage/index.html"
    }]],
    moduleNameMapper: {
        '^shared-library/(.*)$': '<rootDir>/projects/shared-library/src/lib/$1'
    },
    testPathIgnorePatterns: ['/node_modules/', '/integration/'],
  };

