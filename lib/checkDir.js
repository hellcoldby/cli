const path = require('path')
const fs = require("fs-extra");
const chalk = require('chalk');
// 询问用户
const inquirer = require("inquirer");
const Generator = require('./build');


module.exports = async (name, options) => {
    const cwd = process.cwd();
    // 输出文件的目标目录
    const destDir = path.join(cwd, name);
    // console.log('--------', destDir);

    // 如果目录已经存在，询问是否覆盖（移除，并重新创建）
    if (fs.existsSync(destDir)) {
        // 是否强制创建，force 代表是否强制执行
        if (options.force) {
            await fs.remove(destDir);
        } else {
            // 询问用户是否确定要覆盖, action 返回用户选择的结果：
            let { action } = await inquirer.prompt([
                {
                    name: "action",
                    type: "list",
                    message: "目标目录已经存在请选择一个操作:",
                    choices: [
                        {
                            name: "1.覆盖",
                            value: "overwrite",
                        },
                        {
                            name: "2.取消",
                            value: false,
                        },
                    ],
                },
            ]);
            if (!action) {
                return;
            } else if (action === "overwrite") {
                // 移除已存在的目录
                console.log(chalk.hex("#ff8800").bold(`\r\n移除中...`));
                await fs.remove(destDir);
                console.log(chalk.hex("#ff8800").bold(`\r\n移除完成，重新创建...`));
            }
        }
    }

    // 构建项目目录和文件
    const createtor = new Generator(name, destDir);
    createtor.create();
};
