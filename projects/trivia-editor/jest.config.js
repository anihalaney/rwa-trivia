const {defaults} = require('jest-config');
console.log(defaults.moduleFileExtensions);
module.exports = {
    globals: {
      'ts-jest': {
        allowSyntheticDefaultImports: true,
      },
    },
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  };
