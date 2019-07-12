const execSync = require('child_process').execSync;
const yargs = require('yargs');
// Projects refers to different web application which we need to run
const projects = ["trivia", "trivia-admin", "trivia-editor"]; 
// Product variants
const productVariants = ["trivia", "bitwiser-edu"]; 
// Different deployment environments 
const env = ['dev', 'staging', 'production'];
// Different mobile package names
const packageNames = ["io.bitwiser.trivia", "io.bitwiser.trivia.dev", "io.bitwiser.edu.dev"];
const firebaseProjects = [ "trivia-dev",
    "trivia-staging",
    "trivia-production",
    "bitwiser-edu-dev",
    "bitwiser-edu-staging",
    "bitwiser-edu-production"
];
const schedularEnv = ['dev', 'prod'];
const platForms = ['android', 'ios'];




const buildSsr = `ng build trivia  --configuration=productVariant-env && 
                ng build trivia-admin  --configuration=productVariant-env && 
                ng build trivia-editor --configuration=productVariant-env && 
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
                    npx cp functions/app-functions.js functions/index.js && 
                    firebase deploy -P project --only functions && 
                    npx rimraf functions/index.js && 
                    npx cp functions/ssr-functions.js functions/index.js && 
                    firebase deploy -P project --only functions:ssr && 
                    firebase deploy -P project --only hosting && 
                    npm install firebase@6.0.2`;

const commandList = {
        "run-web": 
            {   "command" : `ng serve project --configuration=productVariant-env`,
                "description" : "start web/admin/editor app",
                "options" : { 
                            "project" : { 
                                "demand" : true,
                                "description": 'project Name e.g. trivia',
                                "type": 'string',
                                "choices":  projects,
                                "default": "trivia",
                                "alias" : ['P','p']
                            },
                            "productVariant" : { 
                                "demand" : true,
                                "description": 'configuration project name defined in angular.json e.g. trivia',
                                "type": 'string',
                                "choices":  productVariants,
                                "default": "trivia",
                                "alias" : ['PV','pv']
                            },
                            "env" : { 
                                "demand" : true,
                                "description": 'project environment e.g. production',
                                "type": 'string',
                                "choices":  env,
                                "default": "dev",
                                "alias" : 'e'
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
                    "choices":  firebaseProjects,
                    "default": 'trivia-dev',
                    "alias" : ['P','p']
                }
            }
        },
        "deploy-functions":
        {      
            "command" : deployFunctionsCommand,             
              "description" : "deploy firebase functions to staging/production env",
              "options" : { 
                "project" : { 
                    "demand" : true,
                    "description": 'project Name from .firebaserc e.g. trivia-staging',
                    "type": 'string',
                    "choices":  firebaseProjects,
                    "default": 'trivia-staging',
                    "alias" : ['P','p']
                },
                "productVariant" : { 
                    "demand" : true,
                    "description": 'configuration project name defined in angular.json e.g. trivia',
                    "type": 'string',
                    "choices":  productVariants,
                    "default": 'trivia',
                    "alias" : ['PV','pv']
                },
                "env" : { 
                    "demand" : true,
                    "description": 'project env e.g. staging',
                    "type": 'string',
                    "choices":  env,
                    "default": 'staging',
                    "alias" : ['E' ,'e']
                },
                "setConfig" : { 
                    "demand" : false,
                    "hidden" : true
                },
            },
            "builder" : args => {
                const env = args.argv.env;
                const project = args.argv.project;
                args.argv.setConfig = env === 'production' ? `npm run firebase -P ${project} functions:config:set environment.production=true` :  '';
            }
        },
        "run-mobile":
        {
            "command" : "tns run platform  --bundle environment forDevice --env.package_name=packageName --env.project=productVariant ",
            "description" : "run android/ios app in staging/production environment",
            "options" : { 
                "productVariant" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  productVariants,
                    "default": 'trivia',
                    "alias" : ['PV','pv']
                },
                "packageName" : { 
                    "demand" : true,
                    "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                    "type": 'string',
                    "choices":  packageNames,
                    "default": 'io.bitwiser.trivia.dev',
                    "alias" : ['pk','PK']
                },
                "platform" : { 
                    "demand" : true,
                    "description": 'Mobile platform e.g. android',
                    "type": 'string',
                    "choices":  platForms,
                    "default": 'android',
                    "alias" : ['plt','PLT']
                },
                "environment" : {
                    "demand" : false,
                    "default": 'dev',
                    "coerce" : args => args === 'production' ? '--env.prod --env.aot --env.uglify' : '',
                    "alias" : ['E','e']  
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
                        --env.project=productVariant
                        --release 
                        androidRelease`,
            "description" :  "release android app for staging environment",
            "options" : { 
                "productVariant" : { 
                    "demand" : true,
                    "description": 'project Name e.g. trivia',
                    "type": 'string',
                    "choices":  productVariants,
                    "default": 'trivia',
                    "alias" : ['PV','pv']
                },
                "packageName" : { 
                    "demand" : true,
                    "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                    "type": 'string',
                    "choices":  packageNames,
                    "default": 'io.bitwiser.trivia.dev',
                    "alias" : ['pk','PK']
                },
                "platformName" : { 
                    "demand" : true,
                    "description": 'Mobile platform e.g. android',
                    "type": 'string',
                    "choices":  platForms,
                    "default": 'android',
                    "alias"  : ['plt','PLT']
                },
                "environment" : {
                    "demand" : false,
                    "default": 'dev',
                    "description": 'project environment e.g. production',
                    "coerce" : args => args === 'production' ? '--env.prod' : '',
                    "alias" : ['E','e']
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
                   const productVariant = args.argv.productVariant;
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


                    args.argv.androidRelease = ` --key-store-path certificates/${productVariant}/${platformName}/bitwiser.keystore
                    --key-store-password ${keyStorePassword}
                    --key-store-alias ${keyStoreAlias} 
                    --key-store-alias-password ${keyStoreAliasPassword} 
                    --copy-to ${productVariant}.apk`;
                } else {
                    args.options({'buildCmd': { 'default': 'prepare'}, 'forDevice': { 'default': '--for-device'}});
                    args.argv.androidRelease = '';
                }
              }
        },
        "run-schedular": {
            "command" : "npx rimraf scheduler/server  & tsc --project scheduler && node scheduler/server/run-scheduler.js env",
            "description" : "run schedular for given environment",
            "options" : { 
                "env" : { 
                    "demand" : true,
                    "description": 'schedular environment dev/prod',
                    "type": 'string',
                    "choices":  schedularEnv,
                    "default": 'dev',
                    "alias" : ['se', 'SE']
                }
            }
        }

}

for (const cmd in commandList) {
    if (commandList.hasOwnProperty(cmd)) {
        if (process.argv[2] === cmd) {
            const argv = yargs
            .command(cmd, commandList[cmd].description, commandList[cmd].builder ? commandList[cmd].builder : function(){
            }, function(argv){
                let executableCmd = commandList[cmd].command;
                for (const opt in commandList[cmd].options) {
                    if (commandList[cmd].options.hasOwnProperty(opt)) {
                        
                        executableCmd = executableCmd.replace(new RegExp(escapeRegExp(opt), 'g'), argv[opt]);
                    }
                }
                executeCommand(executableCmd);
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

function executeCommand(executableCmd){
    try {
     executableCmd = executableCmd.replace(/(\r\n|\n|\r)/gm, ""); //remove new line
     console.log(`Executing command ${executableCmd}`);
     execSync(executableCmd, {stdio: 'inherit'});
    } catch(error) {
        console.error(error);
    }
}
