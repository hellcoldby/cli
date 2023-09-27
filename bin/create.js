const path = require('path')
const fs = require("fs-extra");
const chalk = require("chalk");
// 询问用户输入
const inquirer = require("inquirer");

module.exports = async (name, options) => {
    const cwd = process.cwd();
    // 输出文件的目标目录
    const destDir = path.join(cwd, name);
    if (fs.existsSync(destDir)) {
        // 是否强制创建，force 代表是否强制执行
        if (options.force) {
            await fs.remove(destDir);
        } else {
            // 询问用户是否确定要覆盖
            let { action } = await inquirer.prompt([
                {
                    name: "action",
                    type: "list",
                    message: "Target directory already exists Pick an action:",
                    choices: [
                        {
                            name: "Overwrite",
                            value: "overwrite",
                        },
                        {
                            name: "Cancel",
                            value: false,
                        },
                    ],
                },
            ]);

            if (!action) {
                return;
            } else if (action === "overwrite") {
                // 移除已存在的目录
                console.log(chalk.hex("#ff8800").bold(`\r\nRemoving...`));
                await fs.remove(destDir);
                console.log(chalk.hex("#ff8800").bold(`\r\ninquirer start...`));
            }
        }
    }

};
