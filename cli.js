const chalk = require('chalk')
const rl = require('readline');
const arg =  require('arg');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const inquirer = require('inquirer');
const exec = require('child_process').exec;
const adapter = new FileSync('db.json')
const db = low(adapter)
const { spawn } = require('child_process');
const yargs = require('yargs');
// Set some defaults (required if your JSON file is empty)
db.defaults({ todos: [] }).write()
const projects = ["trivia", "bitwiser-edu", "trivia-admin", "trivia-editor"];
const configProject = ["trivia", "bitwiser-edu"];
const env = ['dev', 'staging', 'production'];
const projectEnvironment = ['dev', 'production'];
const commandList = {
    "start": 
        { "command" : "ng serve projectName --configuration=configProject-environment",
          "args" : [{"projectName" : projects},
                    {"configProject" : configProject},
                    {"environment": env}]
        },
    "deploy-functions-local":  
        { "command" : "npm run rmdir /s/q functions\\server & tsc --project functions  && firebase serve -P configProject-dev  --only functions",
        "args" : [
                    {"configProject" : configProject}
                ]
        },
    "deploy-functions":
        {
                        // ng build trivia  --configuration=bitwiser-edu-staging && ng build trivia-admin  --configuration=bitwiser-edu-staging && ng build trivia-editor --configuration=bitwiser-edu-staging && ng run trivia:server && rmdir /s/q functions\server &               tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js && cpx dist/index.html functions/dist && rimraf dist/index.html &&    extraCmd.index                                                                                rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P bitwiser-edu-staging   --only functions && rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P bitwiser-edu-staging --only functions:ssr && firebase deploy -P bitwiser-edu-staging --only hosting && npm install firebase@6.0.2
            "command" : "ng build trivia  --configuration=configProject-environment && ng build trivia-admin  --configuration=configProject-environment && ng build trivia-editor --configuration=configProject-environment && ng run trivia:server && rmdir /s/q functions\\server & tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js && cpx dist/index.html functions/dist && rimraf dist/index.html &&    extraCmd.index                                                                                rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P configProject-environment   --only functions && rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P configProject-environment --only functions:ssr && firebase deploy -P configProject-environment --only hosting && npm install firebase@6.0.2",
                        // `ng build trivia  --configuration=trivia-production          && ng build trivia-admin  --configuration=trivia-admin-production &&  ng build trivia-editor  --configuration=trivia-production       && ng run trivia:server && rmdir /s/q functions\\server & tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js && cpx dist/index.html functions/dist && rimraf dist/index.html [&& firebase -P trivia-production functions:config:set environment.production=true] && rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P trivia-production           --only functions && rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P trivia-production         --only functions:ssr && firebase deploy -P trivia-production         --only hosting && npm install firebase@6.0.2`
            "args": [
                {"projectName" : projects},
                {"configProject" : configProject},
                {"environment": env}
            ],
            "extraCmd" : 
                {
                    "index": { "condition" : "args.environment === 'production'",
                               "cmd": "firebase -P trivia-production functions:config:set environment.production=true &&" 
                             }
                }
        },

        "prod:deploy-functions":
        {
                        
                        // ng build trivia  --configuration=bitwiser-edu-staging && ng build trivia-admin  --configuration=bitwiser-edu-staging && ng build trivia-editor --configuration=bitwiser-edu-staging && ng run trivia:server && rmdir /s/q functions\server &               tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js && cpx dist/index.html functions/dist && rimraf dist/index.html &&    extraCmd.index                                                                                rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P bitwiser-edu-staging   --only functions && rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P bitwiser-edu-staging --only functions:ssr && firebase deploy -P bitwiser-edu-staging --only hosting && npm install firebase@6.0.2
                        // ng build trivia  --configuration=bitwiser-edu-staging && ng build trivia-admin  --configuration=bitwiser-edu-staging && ng build trivia-editor --configuration=bitwiser-edu-staging && ng run trivia:server && rmdir /s/q functions\server & tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js && cpx dist/index.html functions/dist && rimraf dist/index.html &&                                                                                    rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P bitwiser-edu-staging   --only functions && rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P bitwiser-edu-staging --only functions:ssr && firebase deploy -P bitwiser-edu-staging --only hosting && npm install firebase@6.0.2
            "command" : "ng build trivia  --configuration=configProject-environment && ng build trivia-admin  --configuration=configProject-environment && ng build trivia-editor --configuration=configProject-environment && ng run trivia:server && rmdir /s/q functions\\server & tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js && cpx dist/index.html functions/dist && rimraf dist/index.html && firebase -P configProject-environment functions:config:set environment.production=true &&  rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P configProject-environment   --only functions && rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P configProject-environment --only functions:ssr && firebase deploy -P configProject-environment --only hosting && npm install firebase@6.0.2",
                        // `ng build trivia  --configuration=trivia-production          && ng build trivia-admin  --configuration=trivia-admin-production &&  ng build trivia-editor  --configuration=trivia-production       && ng run trivia:server && rmdir /s/q functions\\server & tsc --project functions && npm install firebase@5.2.0 && webpack --config webpack.server.config.js && cpx dist/index.html functions/dist && rimraf dist/index.html [&& firebase -P trivia-production functions:config:set environment.production=true] && rimraf functions/index.js &&  cp functions/app-functions.js functions/index.js && firebase deploy -P trivia-production           --only functions && rimraf functions/index.js && cp functions/ssr-functions.js functions/index.js && firebase deploy -P trivia-production         --only functions:ssr && firebase deploy -P trivia-production         --only hosting && npm install firebase@6.0.2`
            "args": [
                {"projectName" : projects},
                {"configProject" : configProject},
                {"environment": env}
            ]
            // "extraCmd" : 
            //     {
            //         "index": { "condition" : "args.environment === 'production'",
            //                    "cmd": "firebase -P trivia-production functions:config:set environment.production=true &&" 
            //                  }
            //     }
        }


}

const argv = yargs
    .command('lyr', 'Tells whether an year is leap year or not', {
        year: {
            description: 'the year to check for',
            alias: 'y',
            type: 'number',
        }
    })
    .option('time', {
        alias: 't',
        description: 'Tell the present Time',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h')
    .argv;
console.log(argv, 'argv');
const args = process.argv
let ExecutableCmd = '';

// usage represents the help guide
const usage = function() {
  const usageText = `
  todo helps you manage you todo tasks.
  usage:
    todo <command>
    commands can be:
    start:      used to start project Arguments projectName and environment
  `
  console.log(usageText)
}

// used to log errors to the console in red color
function errorLog(error) {
  const eLog = chalk.red(error)
  console.log(eLog)
}


function prompt(question) {
  const r = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  return new Promise((resolve, error) => {
    r.question(question, answer => {
      r.close()
      resolve(answer)
    });
  })
}

function validateArgument(newCmd) {
  // check that length
  if (newCmd.args) {
      for (const [index, arg] of newCmd.args.entries()) {
          if (!args[index+3]) {
            invalidArgument();
          } else {
            for (const key in arg) {
                if (arg.hasOwnProperty(key) && arg[key].indexOf(args[index+3]) >= 0 ) {
                    newCmd.command = newCmd.command.replace(new RegExp(escapeRegExp(key), 'g'), args[index+3]);
                     newCmd.args[index][key] = args[index+3];
                     if (key === 'environment') {
                         args.environment = args[index+3];
                        console.log(args[index+3]);
                     }
                } else {
                    invalidArgument();
                }
            }
          }
      }

      if (newCmd.extraCmd) {

        for (const cmd in newCmd.extraCmd) {
            console.log(eval(newCmd.extraCmd[cmd].condition));

            console.log(args.environment);
            
            if (newCmd.extraCmd.hasOwnProperty(cmd) && newCmd.command.indexOf(`extraCmd.${cmd}`) >= 0 && eval(newCmd.extraCmd[cmd].condition) ) {
                newCmd.command = newCmd.command.replace(new RegExp(escapeRegExp(`extraCmd.${cmd}`), 'g'), newCmd.extraCmd[cmd].cmd);
            } else {
                newCmd.command = newCmd.command.replace(new RegExp(escapeRegExp(`extraCmd.${cmd}`), 'g'), '');
            }
            console.log(newCmd.command);

            // if(cmd){
            //   for (const key in arg) {
            //       if (arg.hasOwnProperty(key) && arg[key].indexOf(args[index+3]) >= 0 ) {
            //           newCmd.command = newCmd.command.replace(new RegExp(escapeRegExp(key), 'g'), args[index+3]);
    
            //       } else {
            //           invalidArgument();
            //       }
            //   }
            // }

        }
      }

      return newCmd.command;
  }
}

function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


function invalidArgument() {
    errorLog('invalid argument passed');
    usage();
    process.exit(22);
}

function buildCommand() 
{
    if(!args[2]){
        invalidArgument(); 
    }else if(args[2] === 'help'){
        usage();
        process.exit(22);
    } else if(!commandList[args[2]]){
        invalidArgument(); 
    } else {
        ExecutableCmd = validateArgument(commandList[args[2]]);
    }
}
buildCommand();
// console.log(ExecutableCmd);
// var child = exec(ExecutableCmd, function (err, stdout, stderr) {

//     console.log('over');
// });
// child.stdout.on('data', function(data) {

//     process.stdout.write(data);

//     //process.stdin.resume();
// });
// child.stdout.on('end', function() {
//     console.log('end out');
// });
// child.stdout.on('close', function() {
//     console.log('close out');
// });
// child.on('exit', function() {
//     console.log('exit');
// });
// child.on('close', function() {
//     console.log('close');
// });
// child.on('disconnect', function() {
//     console.log('disconnect');
// });

// // read stdin and send to child process
// process.stdin.on('readable', function() {

//     var chunk = process.stdin.read();

//     if(chunk !== null) {
//         child.stdin.write(chunk);
//     }
// });