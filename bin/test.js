// const chalk = require('chalk');
// const rl = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   rl.on('line', input => {
//     console.log(`接受line: ${input}`)
//   })

  
//   rl.question( chalk.blue.bgRed.bold( `--> What's your name?\n`)  , name => {
//     console.log( chalk.blue.bgRed.bold(`Hi ${name}!`));
//     rl.close();
//   });
  

// const { resolve } = require('path');
// const { existsSync } = require('fs');
// const version = process.env.CLI_BIN || '1.0.0';

// const CLI_BIN = resolve(__dirname, process.platform, version, 'cli-bin');
// console.log(CLI_BIN);

// process.exit(1);

const fs = require('fs');

fs.readFile('./123.txt', (err, data)=>{
    if(err) {console.log(err); return};

    // const con = data.toString('utf-8');
    console.log(data);
})