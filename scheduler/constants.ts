export enum schedulerConstants {
    cronExpression = '*/1 * * * *', // every 1 hour
    turnCronExpression = '* */5 * * *', // every 5 minute
    extensionName = '.cloudfunctions.net',
    domainZone = 'us-central1',
    port = 443,
    devFunctionsAppName = 'rwa-trivia-dev-e57fc',
    prodFunctionsAppName = 'rwa-trivia',
    gameOverappPath = '/app/game/game-over/scheduler',
    turnChangeappPath = '/app/game/turn/scheduler',
    prod = 'prod',
    authToken = '1234567'
}
