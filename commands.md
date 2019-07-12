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
                            use choices: array of valid argument values",
            "coerce" : {
                "type" : function
                "description" : "use to manipulate given specific option(argument)"
            }
        },
        "builder" : {
            "type" function
            "description" : "use to manipulate the arguments before run callback function"
        }
    }

4) get help related to any command npm run cli <command> -- -h 
    e.g. npm run cli start -- -h

Commands :

1)  command: run-web
    description:  this command is used to start web application (trivia, trivia-admin, trivia-editor)
    e.g.       :  npm run cli start -- --projectName trivia-admin --configProject bitwiser-edu --environment production     
    arguments  :  projectName = the project to be run e.g. trivia-admin
                  configProject and enviroment = configuration project name defined in angular.json e.g. bitwiser-edu-dev
                  where bitwiser-edu is configProject and dev is environment 

2) command: run-functions
    e.g.       :  npm run cli run-functions -- --projectName trivia-staging
    description:  this command is used to start firebase functions in local
    arguments  : projectName = project Name from .firebaserc e.g. trivia-staging


3) command: deploy-functions
    e.g.       :  npm run cli deploy-functions -- --projectName trivia-staging --configProject trivia  --environment staging
    description:  deploy firebase functions to staging/production env
    arguments  :  projectName = project Name from .firebaserc e.g. trivia-staging
                  configProject = configuration project name defined in angular.json e.g. trivia
                  environment = project environment e.g. staging

4) command: run-mobile
    description:  run android/ios app in staging/production environment
    e.g.       :  npm run cli run-mobile -- --configProject trivia --packageName io.bitwiser.trivia.dev --platform android --environment                   staging
    arguments  :  configProject = project Name e.g. trivia
                  packageName = project package name defined in firebase e.g. io.bitwiser.trivia.dev
                  platform = Mobile platform e.g. android
                  environment = project environment


5) command: run-schedular
    e.g.       :  npm run cli run-schedular -- --schedularEnv prod
    description:  run schedular for given environment
    arguments  :  schedularEnv = schedular environment dev/prod

