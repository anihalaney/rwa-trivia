const execSync = require('child_process').execSync;
const yargs = require('yargs');
const projects = ["trivia", "trivia-admin", "trivia-editor"]; // projects refers to different web application which we need to run
const configProject = ["trivia", "bitwiser-edu"]; // config project refers to the certain project env in which we need to run the app 
const env = ['dev', 'staging', 'production'];
const packageNames = ["io.bitwiser.trivia", "io.bitwiser.trivia.dev", "io.bitwiser.edu.dev"];
const firebaseProject = [ "trivia-dev",
    "trivia-staging",
    "trivia-production",
    "bitwiser-edu-dev",
    "bitwiser-edu-staging",
    "bitwiser-edu-production"
];
const schedularEnv = ['dev', 'prod'];
const platForms = ['android', 'ios'];

let argv;
let executableCmd = ''; 

const buildSsr = `ng build trivia  --configuration=configProject-configEnvironment && 
                ng build trivia-admin  --configuration=configProject-configEnvironment && 
                ng build trivia-editor --configuration=configProject-configEnvironment && 
                ng run trivia:server`;
const compileFunctions = `npx rimraf functions/server && tsc --project functions`;
const deployFunctionsCommand = `${buildSsr} && 
                    ${compileFunctions} && 
                    npm install firebase@5.2.0 && 
                    npx webpack --config webpack.server.config.js && 
                    npx cpx dist/index.html functions/dist && 
                    npx rimraf dist/index.html && 
                    setConfig
                    npx rimraf functions/index.js && 
                    cp functions/app-functions.js functions/index.js && 
                    firebase deploy -P projectName --only functions && 
                    npx rimraf functions/index.js && 
                    cp functions/ssr-functions.js functions/index.js && 
                    firebase deploy -P projectName --only functions:ssr && 
                    firebase deploy -P projectName --only hosting && 
                    npm install firebase@6.0.2`;

const commandList = {
        "run-web": 
            {   "command" : `ng serve projectName --configuration=configProject-environment`,
                "description" : "start web/admin/editor app",
                "options" : { 
                            "projectName" : { 
                                "demand" : true,
                                "description": 'project Name e.g. trivia',
                                "type": 'string',
                                "choices":  projects,
                                "alias" : 'pr'
                            },
                            "configProject" : { 
                                "demand" : true,
                                "description": 'configuration project name defined in angular.json e.g. trivia',
                                "type": 'string',
                                "choices":  configProject,
                                "alias" : 'conf'
                            },
                            "environment" : { 
                                "demand" : true,
                                "description": 'project environment e.g. production',
                                "type": 'string',
                                "choices":  env,
                                "alias" : 'env'
                            }
                }
        },
        "run-functions":  
        {   "command" : `npx rimraf functions/server & 
                        tsc --project functions  && firebase serve -P projectName  --only functions`,
            "description" : "deploy firebase functions local",
            "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name from .firebaserc e.g. trivia-staging',
                    "type": 'string',
                    "choices":  firebaseProject,
                    "alias" : 'pr'
                }
            }
        },
        "deploy-functions":
        {      
            "command" : deployFunctionsCommand,             
              "description" : "deploy firebase functions to staging env",
              "options" : { 
                "projectName" : { 
                    "demand" : true,
                    "description": 'project Name from .firebaserc e.g. trivia-staging',
                    "type": 'string',
                    "choices":  firebaseProject,
                    "alias" : 'pr'
                },
                "configProject" : { 
                    "demand" : true,
                    "description": 'configuration project name defined in angular.json e.g. trivia',
                    "type": 'string',
                    "choices":  configProject,
                    "alias" : 'conf'
                },
                "configEnvironment" : { 
                    "demand" : true,
                    "description": 'project environment e.g. staging',
                    "type": 'string',
                    "choices":  env,
                    "alias" : ['environment' ,'env']
                },
                "setConfig" : { 
                    "demand" : false,
                    "hidden" : true
                },
            },
            "builder" : args => {
                const env = args.argv.environment;
                const projectName = args.argv.projectName;
                args.argv.setConfig = env === 'production' ? `npm run firebase -P ${projectName} functions:config:set environment.production=true` :  '';
            }
        },
        "run-mobile":
        {
            "command" : "tns run platform  --bundle environment forDevice --env.package_name=packageName --env.project=configProject ",
            "description" : "run android/ios app in staging/production environment",
            "options" : { 
                "configProject" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  configProject,
                    "alias" : 'conf'
                },
                "packageName" : { 
                    "demand" : true,
                    "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                    "type": 'string',
                    "choices":  packageNames,
                    "alias" : 'pck'
                },
                "platform" : { 
                    "demand" : true,
                    "description": 'Mobile platform e.g. android',
                    "type": 'string',
                    "choices":  platForms,
                    "alias" : 'plt'
                },
                "environment" : {
                    "demand" : false,
                    "default": "",
                    "coerce" : args => args === 'production' ? '--env.prod --env.aot --env.uglify' : '',
                    "alias" : 'env'  
                },
                "forDevice" : {
                    "demand" : false,
                    "default": "",
                    "hidden" : true
                }
            },
            "builder" : args => args.argv.platform === 'ios' && args.argv.environment.search('--env.prod') >= 0 ? args.argv.forDevice = ' --for-device' : args.argv.forDevice = ''
        },
        "release-mobile": {
            "command" : `rm -rf platforms/platformName &&
                        tns buildCmd platformName --bundle 
                        environment
                        --env.aot --env.uglify 
                        forDevice
                        --env.package_name=packageName 
                        --env.project=configProject
                        --release 
                        androidRelease`,
            "description" :  "release android app for staging environment",
            "options" : { 
                "configProject" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  configProject,
                    "alias" : 'conf'
                },
                "packageName" : { 
                    "demand" : true,
                    "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                    "type": 'string',
                    "choices":  packageNames,
                    "alias" : 'pck'
                },
                "platformName" : { 
                    "demand" : true,
                    "description": 'Mobile platform e.g. android',
                    "type": 'string',
                    "choices":  platForms,
                    "alias"  : 'plt'
                },
                "environment" : {
                    "demand" : false,
                    "default": "",
                    "description": 'project environment e.g. production',
                    "coerce" : args => args === 'production' ? '--env.prod' : '',
                    "alias" : 'env'
                },
                "androidRelease" : {
                    "demand" : false,
                    "hidden" : true
                },
                "keyStorePassword" : {
                    "demand" : false,
                    "description": 'key store password',
                    "type": 'string'
                },
                "keyStoreAlias" : {
                    "demand" : false,
                    "description": 'key store store alias',
                    "type": 'string'
                },
                "keyStoreAliasPassword" : {
                    "demand" : false,
                    "description": 'key store alias password',
                    "type": 'string'
                },
                "buildCmd" : { 
                    "demand" : false,
                    "type": 'string',
                    "hidden" : true
                },
                "forDevice" : {
                    "demand" : false,
                    "hidden" : true
                }
            },
            "builder" : args => {
                if (args.argv.platformName === 'android') {
                   const configProject = args.argv.configProject;
                   const platformName = args.argv.platformName;
                   const keyStorePassword = args.argv.keyStorePassword;
                   const keyStoreAlias = args.argv.keyStoreAlias;
                   const keyStoreAliasPassword = args.argv.keyStoreAliasPassword;
                   args.options(
                       {
                        'buildCmd': { 'default': 'build'}, 
                        'forDevice': { 'default': ''}
                       }
                    );


                    args.argv.androidRelease = ` --key-store-path certificates/${configProject}/${platformName}/bitwiser.keystore
                    --key-store-password ${keyStorePassword}
                    --key-store-alias ${keyStoreAlias} 
                    --key-store-alias-password ${keyStoreAliasPassword} 
                    --copy-to ${configProject}.apk`;
                } else {
                    args.options({'buildCmd': { 'default': 'prepare'}, 'forDevice': { 'default': '--for-device'}});
                    args.argv.androidRelease = '';
                }
              }
        },
        "run-schedular": {
            "command" : "npx rimraf scheduler/server  & tsc --project scheduler && node scheduler/server/run-scheduler.js schedularEnv",
            "description" : "run schedular for given environment",
            "options" : { 
                "schedularEnv" : { 
                    "demand" : true,
                    "description": 'schedular environment dev/prod',
                    "type": 'string',
                    "choices":  schedularEnv,
                    "alias" : 'se'
                }
            }
        }

}

for (const cmd in commandList) {
    if (commandList.hasOwnProperty(cmd)) {
        if (process.argv[2] === cmd) {
             argv = yargs
            .command(cmd, commandList[cmd].description, commandList[cmd].builder ? commandList[cmd].builder : function(){
            }, function(argv){
                executableCmd = commandList[cmd].command;
                for (const opt in commandList[cmd].options) {
                    if (commandList[cmd].options.hasOwnProperty(opt)) {
                        
                        executableCmd = executableCmd.replace(new RegExp(escapeRegExp(opt), 'g'), argv[opt]);
                    }
                }
                executeCommand();
            })
            .options(commandList[cmd].options)
            .coerce('coerce', cmd.coerce)
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
     executableCmd = executableCmd.replace(/(\r\n|\n|\r)/gm, ""); //remove new line
    //   console.log(executableCmd, 'executableCmd');
     execSync(executableCmd, {stdio: 'inherit'});
    } catch(error) {
        // console.error(error);
    }
}
