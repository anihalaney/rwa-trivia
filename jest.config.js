const { defaults } = require('jest-config');
module.exports = {
    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageReporters: ['html'],
    globals: {
      'ts-jest': {
        diagnostics: { warnOnly: true },
        stringifyContentPathRegex: '\\.html$',
        astTransformers: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer'
        ]
      }
    },
    moduleNameMapper: {
        "^shared-library/(.*)$": "<rootDir>/projects/shared-library/src/lib/$1"
    },
    testPathIgnorePatterns: ['/node_modules/', '/integration/'],
    snapshotSerializers: [
      'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
      'jest-preset-angular/build/AngularSnapshotSerializer.js',
      'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
  };

