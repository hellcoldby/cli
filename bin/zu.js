#! /usr/bin/env node 
console.log('test');

import cmd from 'commander';

// 1.创建项目
cmd.Command('create <project-name>')
    .description('create a new project')
    .option('-f, --force', 'overwrite target directory if it exists')
    .action((...args)=>{
        console.log(args);
    });

// 2. 配置
cmd.Command('config[value')
    .description('inspect and modify config')
    .option('-g, --get <path>', 'get value from option')  // 获取某个配置
    .option('-s, --set <path> <value>', 'set config') // 设置一个配置项
    .option('-d,--delete <path>', 'delete value from option') //删除一个配置项
    .option('-a,--all [value]', 'get all config') //获取所有配置项
    .action((v, cmd) => {

    })

cmd.usage('<command> [option]')
    .version(packageJson.version)

// 监听help命令，执行回调
cmd.on('--help', ()=>{
    console.log();
    console.log(`Run ${chalk.cyan('zu <command> --help')} for detailed usage or given command`);
    console.log();
})

// process.argv 返回当前进程的所有命令行参数。返回值是一个数组。 这段命令必须放在尾部。
cmd.parse(process.argv)