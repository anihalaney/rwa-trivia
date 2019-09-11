Goal : To reduce redundancy and unnecessary complexity in commands while we setup new project we have made
script to run the commands with node, this script will be also useful when we want to run a script
before any command.

1) get help related to any command node cli <command> -h 
    e.g. node cli run-web -h

2) get command list : node cli

Commands :

1)  command: run-web
    description:  this command is used to start web application (trivia, trivia-admin, trivia-editor)
    e.g.       :  node cli run-web --p trivia-admin --pv bitwiser-edu --e production     
    arguments  :  p = the project to be run e.g. trivia-admin
                  pv  =  product variant 
                  e = environment 

2) command: run-functions
    e.g.       :  node cli run-functions --pv trivia --e dev
    description:  this command is used to start firebase functions in local
    arguments  : pv = product variant  e.g. trivia
                 e = environment e.g. dev


3) command: deploy-functions
    e.g.       :  node cli deploy-functions --pv trivia  --e staging
    description:  deploy firebase functions to staging/production env
    arguments  :  pv = product variant e.g. trivia
                  e = project environment e.g. staging

4) command: run-mobile
    description:  run android/ios app in staging/production environment
    e.g.       :  node cli run-mobile --pv trivia --pk io.bitwiser.trivia.dev --plt android --e staging
    arguments  :  pv = productVarient e.g. trivia
                  pk = project package name defined in firebase e.g. io.bitwiser.trivia.dev
                  plt = Mobile platform e.g. android
                  e = project environment

5) command: release-mobile
    description:  release android app for staging/production environment
    e.g.       :  node cli release-mobile --pv trivia --pk io.bitwiser.trivia.dev --plt android --e dev 
                    --keyStorePassword <keyStorePassword> --keyStoreAlias <keyStoreAlias> --keyStoreAliasPassword <keyStoreAliasPassword>
                    --v 28 --vn 1.1
    arguments  :  pv = productVarient e.g. trivia
                  pk = project package name defined in firebase e.g. io.bitwiser.trivia.dev
                  plt = Mobile platform e.g. android
                  e = project environment
                  keyStorePassword = keyStorePassword for android(optional)
                  keyStoreAlias  = key store store alias  for android(optional)         
                  keyStoreAliasPassword  = key store alias password  for android(optional)
                  v = versionCode for android/ios build
                  vn = versionName for android build CFBundleShortVersionString for ios

6) command: run-schedular
    e.g.       :  node cli run-schedular --se prod
    description:  run schedular for given environment
    arguments  :  se = schedular environment dev/prod


7) to add new command
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

