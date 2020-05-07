module.exports = {
    coverageDirectory: '<rootDir>/test/coverage/trivia-editor',
    reporters: ['default', ['jest-stare', {
        "resultDir": "test/result/trivia-editor",
        "coverageLink": "./../../coverage/trivia-editor/index.html"
    }]],
  };
