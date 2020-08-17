const execSync = require('child_process').execSync;
const yargs = require('yargs');
const path = require('path');
const fs = require("fs");
const axios = require('axios');
const template = require('lodash.template');
// Projects refers to different web application which we need to run
const projects = ["trivia", "trivia-admin", "trivia-editor"];
// Product variants
const productVariants = ["trivia", "bitwiser-edu"];
// Different deployment environments 
const env = ['dev', 'staging', 'production'];
// Different mobile package names
const packageNames = ["io.bitwiser.trivia", "io.bitwiser.trivia.dev", "io.bitwiser.edu.dev"];
const firebaseProjects = ["trivia-dev",
    "trivia-staging",
    "trivia-production",
    "bitwiser-edu-dev",
    "bitwiser-edu-staging",
    "bitwiser-edu-production"
];
const schedularEnv = ['dev', 'prod'];
const platForms = ['android', 'ios'];



const buildApps = `ng build trivia  --configuration=productVariant-env && 
                ng build trivia-admin  --configuration=productVariant-env && 
                ng build trivia-editor --configuration=productVariant-env && 
                ng run trivia:server`;
const compileFunctions = `npx rimraf functions/server && npx tsc --project functions`;
const buildSSRServer = `npx webpack --config webpack.server.config.js`;
const deployFunctionsCommand = ` ${buildApps} && 
                    ${compileFunctions} &&                     
                    ${buildSSRServer} &&                   
                    setConfig
                    npx rimraf functions/index.js && 
                    npx cp-cli functions/app-functions.js functions/index.js &&                     
                    firebase deploy -P productVariant-env --only functions &&
                    npx rimraf functions/index.js && 
                    npx cp-cli functions/ssr-functions.js functions/index.js && 
                    firebase deploy -P productVariant-env --only functions:ssr &&                          
                    firebase deploy -P productVariant-env --only hosting`;
                  
const commandList = {
    "run-web":
    {
        "command": `ng serve project --configuration=productVariant-env`,
        "description": "start web/admin/editor app",
        "options": {
            "project": {
                "demand": true,
                "description": 'project Name e.g. trivia',
                "type": 'string',
                "choices": projects,
                "default": 'trivia',
                "alias": ['P', 'p']
            },
            "productVariant": {
                "demand": true,
                "description": 'configuration project name defined in angular.json e.g. trivia',
                "type": 'string',
                "choices": productVariants,
                "default": 'trivia',
                "alias": ['PV', 'pv']
            },
            "env": {
                "demand": true,
                "description": 'project environment e.g. production',
                "type": 'string',
                "choices": env,
                "default": 'dev',
                "alias": 'e'
            }
        },
        "builder": (args) => {
            replaceVariableInIndex([args.argv.project], args.argv.productVariant);
        }
    },
    "run-functions":
    {
        "command": `${compileFunctions} && firebase serve -P productVariant-env --only functions`,
        "description": "deploy firebase functions local",
        "options": {
            "productVariant": {
                "demand": true,
                "description": 'project Name e.g. trivia',
                "type": 'string',
                "choices": productVariants,
                "default": 'trivia',
                "alias": ['PV', 'pv']
            },
            "env": {
                "demand": true,
                "description": 'environment e.g. dev',
                "type": 'string',
                "choices": env,
                "default": 'dev',
                "alias": ['E', 'e']
            }
        }
    },
    "deploy-functions":
    {
        "command": deployFunctionsCommand,
        "description": "deploy firebase functions to staging/production env",
        "options": {
            "productVariant": {
                "demand": true,
                "description": 'configuration project name defined in angular.json e.g. trivia',
                "type": 'string',
                "choices": productVariants,
                "default": 'trivia',
                "alias": ['PV', 'pv']
            },
            "env": {
                "demand": true,
                "description": 'project env e.g. staging',
                "type": 'string',
                "choices": env,
                "default": 'staging',
                "alias": ['E', 'e']
            },
            "setConfig": {
                "demand": false,
                "hidden": true
            },
        },
        "builder": args => {
            const env = args.argv.env;
            const project = args.argv.productVariant;
            args.options(
                {
                    'setConfig': { 'default': env === 'production' ? `firebase -P ${project}-production  functions:config:set environment.production=true && ` : '' }
                }
            );
            replaceVariableInIndex(['trivia', 'trivia-admin'], args.argv.productVariant);
        }
    },
    "mobile":
    {
        "command": "tns app platform --bundle environment forDevice --env.package_name=packageName --env.project=productVariant noHmr",
        "description": "run android/ios app in staging/production environment",
        "options": {
            "productVariant": {
                "demand": true,
                "description": 'project Name e.g. trivia',
                "type": 'string',
                "choices": productVariants,
                "default": 'trivia',
                "alias": ['PV', 'pv']
            },
            "packageName": {
                "demand": true,
                "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                "type": 'string',
                "choices": packageNames,
                "default": 'io.bitwiser.trivia.dev',
                "alias": ['pk', 'PK']
            },
            "platform": {
                "demand": true,
                "description": 'Mobile platform e.g. android',
                "type": 'string',
                "choices": platForms,
                "default": 'android',
                "alias": ['plt', 'PLT']
            },
            "environment": {
                "demand": false,
                "coerce": args => args === 'production' ? '--env.prod --env.aot --env.uglify' : '',
                "default": 'dev',
                "alias": ['E', 'e']
            },
            "forDevice": {
                "demand": false,
                "default": "",
                "hidden": true
            },
            "versionCode": {
                "demand": false,
                "description": 'versionCode for android/ios build ',
                "type": 'string',
                "default": '28',
                "alias": ['V', 'v']
            },
            "versionName": {
                "demand": false,
                "description": 'versionName for android build CFBundleShortVersionString for ios ',
                "type": 'string',
                "default": '1.0',
                "alias": ['VN', 'vn']
            },
            "app": {
                "demand": true,
                "description": 'app e.g. --run',
                "alias": ['a', 'A'],
                "default": 'run',
                "coerce": args => args ? args : 'run',
            },
            "noHmr": {
                "demand": false,
                "description": 'run with no hmr e.g. true',
                "default": 'false',
                "alias": ['NH', 'nh'],
                "coerce": args => {  return args == 'true' ? '--no-hmr' : ''} ,

            }
        },
        "builder": args => args.argv.platform === 'ios' && args.argv.environment.search('--env.prod') >= 0 ? args.argv.forDevice = ' --for-device' : args.argv.forDevice = '',
        "preCommand": async (argv) => { await updateAppVersion(argv, false); await updatePackageJson(argv); }
    },
    "release-mobile": {
        "command": `npx rimraf platforms/platformName &&
                    tns platform add platformName &&
                    tns build platformName --bundle 
                        environment
                        --env.aot --env.uglify 
                        forDevice
                        --env.package_name=packageName 
                        --env.project=productVariant
                        --release 
                        androidRelease`,
        "description": "release android app for staging/production environment",
        "options": {
            "productVariant": {
                "demand": true,
                "description": 'project Name e.g. trivia',
                "type": 'string',
                "choices": productVariants,
                "default": 'trivia',
                "alias": ['PV', 'pv']
            },
            "packageName": {
                "demand": true,
                "description": 'project package name defined in firebase e.g. io.bitwiser.trivia.dev',
                "type": 'string',
                "choices": packageNames,
                "default": 'io.bitwiser.trivia.dev',
                "alias": ['pk', 'PK']
            },
            "platformName": {
                "demand": true,
                "description": 'Mobile platform e.g. android',
                "type": 'string',
                "choices": platForms,
                "default": 'ios',
                "alias": ['plt', 'PLT']
            },
            "environment": {
                "demand": false,
                "default": "staging",
                "description": 'project environment e.g. production',
                "coerce": args => args === 'production' ? '--env.prod' : '',
                "alias": ['E', 'e']
            },
            "versionCode": {
                "demand": true,
                "description": 'versionCode for android/ios build ',
                "type": 'string',
                "alias": ['V', 'v']
            },
            "versionName": {
                "demand": true,
                "description": 'versionName for android build CFBundleShortVersionString for ios ',
                "type": 'string',
                "alias": ['VN', 'vn']
            },
            "androidRelease": {
                "demand": false,
                "hidden": true
            },
            "keyStorePassword": {
                "demand": false,
                "description": 'key store password',
                "type": 'string'
            },
            "keyStoreAlias": {
                "demand": false,
                "description": 'key store store alias',
                "type": 'string'
            },
            "keyStoreAliasPassword": {
                "demand": false,
                "description": 'key store alias password',
                "type": 'string'
            },
            "forDevice": {
                "demand": false,
                "hidden": true
            }
        },
        "builder": args => {
            if (args.argv.platformName === 'android') {
                const productVariant = args.argv.productVariant;
                const platformName = args.argv.platformName;
                const keyStorePassword = args.argv.keyStorePassword;
                const keyStoreAlias = args.argv.keyStoreAlias;
                const keyStoreAliasPassword = args.argv.keyStoreAliasPassword;
                args.options(
                    {
                        'forDevice': { 'default': '' }
                    }
                );

                args.argv.androidRelease = ` --key-store-path certificates/${productVariant}/${platformName}/bitwiser.keystore
                    --key-store-password ${keyStorePassword}
                    --key-store-alias ${keyStoreAlias} 
                    --key-store-alias-password ${keyStoreAliasPassword}
                    --copy-to ${productVariant}.apk`;
            } else {
                args.options({ 'forDevice': { 'default': '--for-device' } });
                args.argv.androidRelease = ' && tns publish ios --ipa platforms/ios/build/Release-iphoneos/rwatrivia.ipa';
            }
        },
        "preCommand": async (argv) => { await updateAppVersion(argv, true); await updatePackageJson(argv); }
    },
    "run-schedular": {
        "command": "npx rimraf scheduler/server  & tsc --project scheduler && node scheduler/server/run-scheduler.js env",
        "description": "run schedular for given environment",
        "options": {
            "env": {
                "demand": true,
                "description": 'schedular environment dev/prod',
                "type": 'string',
                "choices": schedularEnv,
                "default": 'dev',
                "alias": 'se'
            }
        }
    }

}

function buildCommands() {

    let argv = yargs
        .usage('usage: $0 <command>');
    for (const cmd in commandList) {
        argv = argv
            .command(cmd, commandList[cmd].description, function (args) {
                argv = yargs.options(commandList[cmd].options);
                if (commandList[cmd].builder) {
                    commandList[cmd].builder(args);
                }

            }, async function (argv) {
                let executableCmd = commandList[cmd].command;
                for (const opt in commandList[cmd].options) {
                    if (commandList[cmd].options.hasOwnProperty(opt)) {
                        executableCmd = executableCmd.replace(new RegExp(escapeRegExp(opt), 'g'), argv[opt]);
                    }
                }
                if (commandList[cmd].preCommand) {
                    await commandList[cmd].preCommand(argv);
                }
                executeCommand(executableCmd);
            });
    }

    argv = argv.help()
        .alias('help', 'h')
        .argv;

    checkCommands(yargs, argv, 2);

}


function checkCommands(yargs, argv, numRequired) {
    console.log(argv);
    if (argv._.length < numRequired) {
        yargs.showHelp()
    } else {
        // check for unknown command
    }
}

function replaceVariableInIndex(projectList, productVarient) {

    for (const project of projectList) {
        const filepath = `./projects/${project}/src/index.html`;
        let buffer = fs.readFileSync(filepath, { encoding: 'utf-8', flag: 'r' });
        const config = getConfig(productVarient);
        const compiled = template(buffer);
        buffer = compiled(config);
        const options = { encoding: 'utf-8', flag: 'w' };
        fs.writeFileSync(filepath, buffer, options);
    }

}

async function updateAppVersion(argv, isRelease) {
    try {
        const platform = argv.plt;
        const environment = argv.environment.search('--env.prod') >= 0 ? 'production' : 'staging';
        const filepath = platform === 'android' ?
            `./App_Resources/Android/src/main/AndroidManifest.xml` : `./configurations/${argv.productVariant}/ios/info.plist.${environment === 'production' ? 'prod' : 'dev'}`;
        let buffer = fs.readFileSync(filepath, { encoding: 'utf-8', flag: 'r' });
        let compiled = template(buffer);
        buffer = compiled({ 'versionCode': argv.versionCode, 'versionName': argv.versionName, 'EXECUTABLE_NAME': '${EXECUTABLE_NAME}' });
        let options = { encoding: 'utf-8', flag: 'w' };
        fs.writeFileSync(filepath, buffer, options);

        const config = getConfig(argv.productVariant);

        // we need to make a seperate command to update version in firebase after uploading to appstore/playstore 

        // if (isRelease) {
            // await axios({
            //     method: 'post',
            //     url: `${config.functionsUrl[environment]}/general/updateAppVersion`,
            //     headers: { 'token': argv.token, 'Content-Type': 'application/json' },
            //     data: {
            //         'versionCode': argv.versionCode,
            //         'platform': platform
            //     }
            // });
        // }


    } catch (error) {
        console.log(error, 'error');
    }

}

function updatePackageJson(argv) {

    // update package.json
    let buffer = fs.readFileSync('package.json', { encoding: 'utf-8', flag: 'r' });
    const compiled = template(buffer);
    buffer = compiled({ 'packageName': argv.packageName });
    let options = { encoding: 'utf-8', flag: 'w' };
    fs.writeFileSync('package.json', buffer, options);

}

function getConfig(productVarient) {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, `projects/shared-library/src/lib/config/${productVarient}.json`), 'utf8'));
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function executeCommand(executableCmd) {
    try {
        executableCmd = executableCmd.replace(/(\r\n|\n|\r)/gm, ""); //remove new line
        console.log(`Executing command ${executableCmd}`);
        execSync(executableCmd, { stdio: 'inherit' });
    } catch (error) {
    }
}

buildCommands();