const execSync = require('child_process').execSync;
const yargs = require('yargs');
const projects = ["trivia", "bitwiser-edu", "trivia-admin", "trivia-editor"];
const configProject = ["trivia", "bitwiser-edu"];
const env = ['dev', 'staging', 'production'];
const packageNames = ["io.bitwiser.trivia", "io.bitwiser.trivia.dev", "io.bitwiser.edu.dev"];

let argv;
let executableCmd = '';

const commandList = {
    "start": 
        {   "command" : `ng serve projectName --configuration=configProject-environment`,
            "description" : "start web/admin/editor app",
            "options" : { 
                        "projectName" : { 
                            "demand" : true,
                            "description": 'project Name e.g. trivia',
                            "type": 'string',
                            "choices":  projects
                        },
                        "configProject" : { 
                            "demand" : true,
                            "description": 'configuration project name defined in angular.json e.g. trivia',
                            "type": 'string',
                            "choices":  configProject
                        },
                        "environment" : { 
                            "demand" : true,
                            "description": 'environment',
                            "type": 'string',
                            "choices":  env
                        }
            }
    },
    "deploy-functions-local":  
        {   "command" : "npx rimraf functions/server & tsc --project functions  && firebase serve -P configProject-dev  --only functions",
            "description" : "deploy firebase functions local",
            "options" : { 
                "configProject" : { 
                    "demand" : true,
                    "description": 'configuration project name defined in angular.json e.g. trivia',
                    "type": 'string',
                    "choices":  configProject
                }
            }
        },
        "deploy-functions":
        {
            //"command" : "npm run ng build trivia  --configuration=configProject-environment && npm run ng build trivia-admin  --configuration=configProject-environment && npm run ng build trivia-editor --configuration=configProject-environment && npm run ng run trivia:server && npm run rmdir /s/q functions\\server && tsc --project functions && npm install firebase@5.2.0 &&     webpack --config webpack.server.config.js &&     cpx dist/index.html functions/dist && rimraf dist/index.html &&      extraCmd.index      rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P configProject-environment   --only functions &&     rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P configProject-environment --only functions:ssr && firebase deploy -P configProject-environment --only hosting && npm install firebase@6.0.2",                        
     //2:31   "command" : `npm run ng build trivia  --configuration=trivia-staging    && ng build trivia-admin  --configuration=trivia-admin-staging      && ng build trivia-editor --configuration=trivia-production         && ng run trivia:server && npm run rmdir /s/q functions\\server & tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js      && cpx dist/index.html functions/dist    && rimraf dist/index.html                   && npm run rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P trivia-dev --only                  functions && npm run rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P trivia-dev --only functions:ssr            && npm run firebase deploy -P trivia-dev --only hosting && npm install firebase@6.0.2`,
              "command" : "ng build trivia  --configuration=configProject-environment && ng build trivia-admin  --configuration=configProject-environment && ng build trivia-editor --configuration=configProject-environment && ng run trivia:server && npx rimraf functions/server          && tsc --project functions && npm install firebase@5.2.0 && npx webpack --config webpack.server.config.js && npx cpx dist/index.html functions/dist && npx rimraf dist/index.html               && npx rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P configProject-environment   --only functions && npx rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P configProject-environment --only functions:ssr && firebase deploy -P configProject-environment --only hosting && npm install firebase@6.0.2",
              "description" : "deploy firebase functions to staging env",
              "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  projects
                },
                "configProject" : { 
                    "demand" : true,
                    "description": 'configuration project name defined in angular.json e.g. trivia',
                    "type": 'string',
                    "choices":  configProject
                },
                "environment" : { 
                    "demand" : true,
                    "description": 'environment',
                    "type": 'string',
                    "choices":  env
                }
            }
        },
        "prod:deploy-functions":
        {
                        
                        // ng build trivia  --configuration=bitwiser-edu-staging && ng build trivia-admin  --configuration=bitwiser-edu-staging && ng build trivia-editor --configuration=bitwiser-edu-staging && ng run trivia:server && rmdir /s/q functions\server &               tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js && cpx dist/index.html functions/dist && rimraf dist/index.html &&    extraCmd.index                                                                                rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P bitwiser-edu-staging   --only functions && rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P bitwiser-edu-staging --only functions:ssr && firebase deploy -P bitwiser-edu-staging --only hosting && npm install firebase@6.0.2
                        // ng build trivia  --configuration=bitwiser-edu-staging && ng build trivia-admin  --configuration=bitwiser-edu-staging && ng build trivia-editor --configuration=bitwiser-edu-staging && ng run trivia:server && rmdir /s/q functions\server & tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js && cpx dist/index.html functions/dist && rimraf dist/index.html &&                                                                                    rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P bitwiser-edu-staging   --only functions && rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P bitwiser-edu-staging --only functions:ssr && firebase deploy -P bitwiser-edu-staging --only hosting && npm install firebase@6.0.2
            "command" : "ng build trivia  --configuration=configProject-environment && ng build trivia-admin  --configuration=configProject-environment && ng build trivia-editor --configuration=configProject-environment && ng run trivia:server && rmdir /s/q functions\\server & tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js && cpx dist/index.html functions/dist && rimraf dist/index.html && firebase -P configProject-environment functions:config:set environment.production=true &&  rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P configProject-environment   --only functions && rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P configProject-environment --only functions:ssr && firebase deploy -P configProject-environment --only hosting && npm install firebase@6.0.2",
                        // `ng build trivia  --configuration=trivia-production          && ng build trivia-admin  --configuration=trivia-admin-production &&  ng build trivia-editor  --configuration=trivia-production       && ng run trivia:server && rmdir /s/q functions\\server & tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js && cpx dist/index.html functions/dist && rimraf dist/index.html [&& firebase -P trivia-production functions:config:set environment.production=true] && rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P trivia-production           --only functions && rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P trivia-production         --only functions:ssr && firebase deploy -P trivia-production         --only hosting && npm install firebase@6.0.2`
            "description" : "deploy firebase functions to production",
            "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  projects
                },
                "configProject" : { 
                    "demand" : true,
                    "description": 'configuration project name defined in angular.json e.g. trivia',
                    "type": 'string',
                    "choices":  configProject
                },
                "environment" : { 
                    "demand" : true,
                    "description": 'environment',
                    "type": 'string',
                    "choices":  env
                }
            }
            // "extraCmd" : 
            //     {
            //         "index": { "condition" : "args.environment === 'production'",
            //                    "cmd": "firebase -P trivia-production functions:config:set environment.production=true &&" 
            //                  }
            //     }
        },
        // "run-scheduler-dev": "npm run compile-scheduler-functions && node scheduler/server/run-scheduler.js dev",
        // "compile-scheduler-functions": "rmdir /s/q scheduler\\server & tsc --project scheduler",

        "dev-android":
        {
            "command" : "tns run android --bundle --env.package_name=packageName --env.project=projectName",
            "description" : "run android app in dev environment",
            "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  projects
                },
                "packageName" : { 
                    "demand" : true,
                    "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                    "type": 'string',
                    "choices":  packageNames
                }
            }
        },
        "prod-android": {
            "command" : "tns run android --bundle --env.prod --env.aot --env.uglify --env.package_name=packageName --env.project=projectName",
            "description" :  "run android app in production environment",
            "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  projects
                },
                "packageName" : { 
                    "demand" : true,
                    "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                    "type": 'string',
                    "choices":  packageNames
                }
            }
        },
        "release-dev-android": {
            "command" : "sh release/projectName/dev-android.sh",
            "description" :  "release android app for staging environment",
            "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  projects
                }
            }
        },
        "release-prod-android": {
            "command" : "sh release/projectName/prod-android.sh",
            "description" : "release android app in production environment",
            "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  projects
                }
            }
        },
        "dev-ios": {
            "command" : "tns run ios --bundle  --env.package_name=packageName --env.project=projectName",
            "description" : "run ios app in staging environment",
            "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  projects
                },
                "packageName" : { 
                    "demand" : true,
                    "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                    "type": 'string',
                    "choices":  packageNames
                }
            }
        },
        "prod-ios": {
            "command" : "tns run ios --bundle --env.prod --env.aot --env.uglify --for-device --env.package_name=packageName --env.project=projectName",
            "description" : "run ios app in production environment",
            "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  projects
                },
                "packageName" : { 
                    "demand" : true,
                    "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                    "type": 'string',
                    "choices":  packageNames
                }
            }
        },
        "release-dev-ios": {
            "command" : "rm -rf platforms/ios && tns prepare ios --bundle --release  --env.aot --env.uglify --for-device --env.package_name=packageName  --env.project=projectName",
            "description" : "release ios app in staging environment",
            "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  projects
                },
                "packageName" : { 
                    "demand" : true,
                    "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                    "type": 'string',
                    "choices":  packageNames
                }
            }
        },
        "release-prod-ios": {
            "command" : "rm -rf platforms/ios && tns prepare ios --bundle --release --env.prod --env.aot --env.uglify --for-device --env.package_name=packageName  --env.project=projectName",
            "description" : "release ios app in production environment",
            "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  projects
                },
                "packageName" : { 
                    "demand" : true,
                    "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                    "type": 'string',
                    "choices":  packageNames
                }
            }
        },
        "run-schedular": {
            "command" : "npx rimraf functions/server  & tsc --project scheduler && node scheduler/server/run-scheduler.js environment",
            "description" : "run schedular for given environment",
            "options" : { 
                "environment" : { 
                    "demand" : true,
                    "description": 'environment',
                    "type": 'string',
                    "choices":  env
                }
            }
        }

}

for (const aCmd in commandList) {
    if (commandList.hasOwnProperty(aCmd)) {
        if (process.argv[2] === aCmd) {
             argv = yargs
            .command(aCmd, commandList[aCmd].description, function(){}, function(argv){
                executableCmd = commandList[aCmd].command;
                for (const opt in commandList[aCmd].options) {
                    if (commandList[aCmd].options.hasOwnProperty(opt)) {
                        executableCmd = executableCmd.replace(new RegExp(escapeRegExp(opt), 'g'), argv[opt]);
                    }
                }
                executeCommand();
            })
            .options(commandList[aCmd].options)
            .help()
            .alias('help', 'h')
            .argv;
        }
    }
}


function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function executeCommand(){
    try {
        console.log(executableCmd, 'executableCmd');
        execSync(executableCmd, {stdio: 'inherit'});
    } catch(error) {
        // console.error(error);
    }
}
