const { defaults } = require('jest-config');
console.log(defaults.moduleFileExtensions);
module.exports = {
    setupFilesAfterEnv: [
        "<rootDir>/projects/trivia/src/setup-jest.ts"
    ],
    verbose: true,
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    moduleNameMapper: {
        "^shared-library/(.*)$": "<rootDir>/projects/shared-library/src/lib/$1"
    },
    transform: {
        '^.+\\.[t|j]s$': [
          'babel-jest',
          {configFile: require.resolve('./.babelrc')},
        ],
      },
}
