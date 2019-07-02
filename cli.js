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
// Set some defaults (required if your JSON file is empty)
db.defaults({ todos: [] }).write()
const projects = ["trivia", "bitwiser-edu", "trivia-admin"];
const env = ['dev', 'staging'];
const commandList = {
    "start": 
        { "command" : "ng serve projectName --configuration=projectName-environment",
          "args" : [{"projectName" : projects},
                    {"environment": env}]
        }
}

const args = process.argv
let ExecutableCmd = '';

function parseArgumentsIntoOptions(rawArgs) {

    const args = arg(
      {
        '--git': Boolean,
        '--yes': Boolean,
        '--install': Boolean,
        '-g': '--git',
        '-y': '--yes',
        '-i': '--install',
      },
      {
        argv: rawArgs.slice(2),
      }
    );
    return {
      skipPrompts: args['--yes'] || false,
      git: args['--git'] || false,
      template: args._[0],
      runInstall: args['--install'] || false,
    };
   }

async function promptForMissingOptions(options) {
    const defaultTemplate = 'JavaScript';
    if (options.skipPrompts) {
      return {
        ...options,
        template: options.template || defaultTemplate,
      };
    }
   
    const questions = [];
    if (!options.template) {
      questions.push({
        type: 'list',
        name: 'template',
        message: 'Please choose which project template to use',
        choices: ['JavaScript', 'TypeScript'],
        default: defaultTemplate,
      });
    }
   
    if (!options.git) {
      questions.push({
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: false,
      });
    }
   
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      template: options.template || answers.template,
      git: options.git || answers.git,
    };
   }



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


// we make sure the length of the arguments is exactly three
// if (args.length > 3 && args[2] != 'complete') {
//   errorLog('only one argument can be accepted')
//   usage()
//   return
// }

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

function newTodo() {
  const q = chalk.blue('Type in your todo\n')
  prompt(q).then(todo => {
    db.get('todos')
      .push({
        title: todo,
        complete: false,
      })
      .write()
  })
  return
}

function getTodos() {
  const todos = db.get('todos').value()
  let index = 1;
  todos.forEach(todo => {
    let todoText = `${index++}. ${todo.title}`
    if (todo.complete) {
      todoText += ' ✔ ️'
    }
    console.log(chalk.strikethrough(todoText))
  })
  return
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
                } else {
                    invalidArgument();
                }
            }
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
console.log(ExecutableCmd);
var child = exec(ExecutableCmd, function (err, stdout, stderr) {

    console.log('over');
});
child.stdout.on('data', function(data) {

    process.stdout.write(data);

    //process.stdin.resume();
});
child.stdout.on('end', function() {
    console.log('end out');
});
child.stdout.on('close', function() {
    console.log('close out');
});
child.on('exit', function() {
    console.log('exit');
});
child.on('close', function() {
    console.log('close');
});
child.on('disconnect', function() {
    console.log('disconnect');
});

// read stdin and send to child process
process.stdin.on('readable', function() {

    var chunk = process.stdin.read();

    if(chunk !== null) {
        child.stdin.write(chunk);
    }
});