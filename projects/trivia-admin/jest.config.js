module.exports = {
    coverageDirectory: '<rootDir>/test/coverage/trivia-admin',
    reporters: ['default', ['jest-stare', {
        "resultDir": "test/result/trivia-admin",
        "coverageLink": "./../../coverage/trivia-admin/index.html"
    }]],
  };

