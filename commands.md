Goal : To reduce redunduncy and unneccessary complexity in commands while we setup new project we have made
script to run the commands with node, this script will be also useful when we want to run a script
before any command.

1) add command "cli": "node cli.js" to run the script 

2) to pass the arguments to script we need to prepand "--" to the arguments.
    e.g. npm run cli serve -- --projectName=trivia --configProject=trivia --environment=dev

3) to add new command
    add command in cli.js
    in given format 
    "command-name" : {
        "type" : string 
        "command" : {
            "type" : string
            "description" : "add command to be run and use arguments name in command string to replace with command line arguments"
        }
        "description" : {
            "type" : string
        }
        "options" : {
            "type" : Object
            "description" : "use to get argument from command line and will be replaced in 'command' string
                            use demand: true for required argument
                            use type: for type of argument required from command line
                            use choices: array of valid argument values"
        }
    }

Commands :

1)  command: start
    description:  this command is used to start web application (trivia, trivia-admin, trivia-editor)
    e.g.       :  npm run cli start -- --projectName trivia-admin --configProject bitwiser-edu --environment production     
    arguments  :  projectName = the project to be run e.g. trivia-admin
                  configProject and enviroment = configuration project name defined in angular.json e.g. bitwiser-edu-dev
                  where bitwiser-edu is configProject and dev is environment 

2) command: deploy-functions-local
    e.g.       :  npm run cli deploy-functions-local -- --projectName trivia-staging
    description:  this command is used to start firebase functions in local
    arguments  : projectName = project Name from .firebaserc e.g. trivia-staging


3) command: deploy-functions
    e.g.       :  npm run cli deploy-functions -- --projectName trivia-staging --configProject trivia  
    description:  deploy firebase functions to staging env
    arguments  :  projectName = project Name from .firebaserc e.g. trivia-staging
                  configProject = configuration project name defined in angular.json e.g. trivia

4) command: prod-deploy-functions
    e.g.       :  npm run cli prod-deploy-functions -- --projectName trivia-staging --configProject trivia  
    description:  deploy firebase functions to production env
    arguments  :  projectName = project Name from .firebaserc e.g. trivia-staging
                  configProject = configuration project name defined in angular.json e.g. trivia

5) command: dev-android
    description:  run android app in staging environment
    e.g.       :  npm run cli dev-android -- --configProject trivia --packageName io.bitwiser.trivia.dev 
    arguments  :  configProject = project Name e.g. trivia
                  packageName = project package name defined in firebase e.g. io.bitwiser.trivia.dev

6) command: prod-android
    e.g.       :  npm run cli prod-android -- --configProject trivia --packageName io.bitwiser.trivia
    description:  run android app in production environment
    arguments  :  configProject = project Name e.g. trivia
                  packageName = project package name defined in firebase e.g. io.bitwiser.trivia

7) command: release-dev-android
    e.g.       :  npm run cli release-dev-android -- --configProject trivia 
    description:  release android app for staging environment
    arguments  :  configProject = project Name e.g. trivia

8) command: release-prod-android
    e.g.       :  npm run cli release-prod-android -- --configProject trivia 
    description:  release android app in production environment
    arguments  :  configProject = project Name e.g. trivia

9) command: dev-ios
    e.g.       :  npm run cli dev-ios -- --configProject trivia --packageName io.bitwiser.trivia.dev
    description:  run ios app in staging environment
    arguments  :  configProject = project Name e.g. trivia
                  packageName = project package name defined in firebase e.g. io.bitwiser.trivia.dev

10) command: prod-ios
    e.g.       :  npm run cli prod-ios -- --configProject trivia --packageName io.bitwiser.trivia
    description:  run ios app in production environment
    arguments  :  configProject = project Name e.g. trivia
                  packageName = project package name defined in firebase e.g. io.bitwiser.trivia


11) command: release-dev-ios
    e.g.       :  npm run cli release-dev-ios -- --configProject trivia --packageName io.bitwiser.trivia.dev
    description:  release ios app in staging environment
    arguments  :  configProject = project Name e.g. trivia
                  packageName = project package name defined in firebase e.g. io.bitwiser.trivia.dev


12) command: release-prod-ios
    e.g.       :  npm run cli release-prod-ios -- --configProject trivia --packageName io.bitwiser.trivia
    description:  release ios app in production environment
    arguments  :  configProject = project Name e.g. trivia
                  packageName = project package name defined in firebase e.g. io.bitwiser.trivia

13) command: run-schedular
    e.g.       :  npm run cli run-schedular -- --schedularEnv prod
    description:  run schedular for given environment
    arguments  :  schedularEnv = schedular environment dev/prod

