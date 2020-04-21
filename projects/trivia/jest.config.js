module.exports = {
    globals: {
      'ts-jest': {
        allowSyntheticDefaultImports: true,
      },
      transform: {
        "^.+\\.(ts|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js",
        "^.+\\.js$": "babel-jest"
      }
    },
    transformIgnorePatterns: [
      "node_modules/(?!@ngrx|angular2-ui-switch|ng-dynamic)"
    ],

    transform: {
      "^.+\\.(ts|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js",
      "^.+\\.js$": "babel-jest"
    }
  };
