module.exports = {
    coverageDirectory: '<rootDir>/test/coverage/trivia',
    reporters: ['default', ['jest-stare', {
        "resultDir": "test/result/trivia",
        "coverageLink": "./../../coverage/trivia/index.html"
    }]],
  };

