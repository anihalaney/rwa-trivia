module.exports = {
    coverageDirectory: '<rootDir>/test/coverage/shared-library',
    reporters: ['default', ['jest-stare', {
        "resultDir": "test/result/shared-library",
        "coverageLink": "./../../coverage/shared-library/index.html"
    }]],
  };

