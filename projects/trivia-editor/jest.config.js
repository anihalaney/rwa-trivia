const {defaults} = require('jest-config');
console.log(defaults.moduleFileExtensions);
module.exports = {
    globals: {
      'ts-jest': {
        allowSyntheticDefaultImports: true,
      },
    },
    // transformIgnorePatterns: [`<rootDir>/node_modules/(?!${esModules})`],
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    jest: {
      transformIgnorePatterns: [
        "node_modules/(?!@ngrx|angular2-ui-switch|ng-dynamic)"
      ],
      transform: {
        "^.+\\.(ts|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js",
        "^.+\\.js$": "babel-jest"
      }
    },
    transform: {
      "^.+\\.(ts|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js",
      "^.+\\.js$": "babel-jest"
    }
  };
