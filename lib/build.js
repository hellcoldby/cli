/*
 *
 *  创建项目和文件
 *
 * */
const chalk = require("chalk"); // 日志美化
const inquirer = require("inquirer"); // 命令行的交互
const ora = require("ora"); // 命令行loading 动画
const spawn = require("cross-spawn"); // 调用shell终端，执行命令
const ejs = require("ejs"); // 模版文件
const fs = require("fs-extra"); // 文件操作相关
const path = require("path");
/**
 * name 项目名称
 * destDir 项目路径
 */
class Generator {
    constructor(name, destDir) {
        this.name = name;
        // 创建项目路径
        this.destDir = destDir;
        // 模版路径
        this.tmpDir = path.join(__dirname, "../templates");
    }

    _copyFile(params, callback) {
        
        fs.readdir(this.tmpDir, (err, files) => {
            console.log('读取模版')
            if (err){
                console.log(err);
                throw err;
            }

            let count = 0;
            // 计数法来判断是否遍历完成
            const checkEnd = function () {
                ++count === files.length && callback();
            };

            console.log('forEach 遍历目录下的文件')
            files.forEach((file) => {
               
                const filePath = path.join(this.tmpDir, file);
                // 获取文件或目录的状态信息
                const stat = fs.statSync(filePath);
                // 模版目录下是否是文件, 如果是文件
                if (stat.isFile()) { 
                   
                    const relativePath = path.relative(this.tmpDir, filePath);
                    // 当前文件的绝对路径
                    const outputAbsolutePath = path.join(this.destDir, relativePath);
                    // 这里有个注意的点，如果是当前文件需要接受用户传递的参数，就用`ejs`模板引擎来处理
                    if (relativePath === "package.json" || relativePath === "index.html") {
                        ejs.renderFile(filePath, params)
                            .then((response) => {
                                const outputDir = path.dirname(outputAbsolutePath);
                                if (!fs.existsSync(outputDir)) {
                                    // 判断文件夹是否存在，不存在就创建
                                    fs.ensureDirSync(outputDir);
                                    // console.log(chalk.cyan(`made directories, starting with ${made}`));
                                }
                                // 文件输出
                                fs.writeFileSync(outputAbsolutePath, response);
                                // console.log(chalk.hex("#67c23a").bold(`create ---> ${outputAbsolutePath}`));
                            })
                            .catch((err) => {
                                console.log(chalk.red(err));
                            });
                    } else {
                        // 直接执行 读取 写入 操作
                        fs.readFile(filePath, "utf-8", (err, resp) => {
                            if (err) throw err;
                            const outputDir = path.dirname(outputAbsolutePath);
                            if (!fs.existsSync(outputDir)) {
                                // 判断文件夹是否存在，不存在就创建
                                fs.ensureDirSync(outputDir);
                                // console.log(chalk.cyan(`made directories, starting with ${made}`));
                            }
                            fs.writeFileSync(outputAbsolutePath, resp);
                            // console.log(chalk.hex("#67c23a").bold(`create ---> ${outputAbsolutePath}`));
                        });
                    }
                    // 执行计数方法
                    checkEnd();
                } else {
                    // 文件夹类型递归
                    // this._copyFile(filePath, destDir, res, rootPath, checkEnd);
                }
            });
        });
    }

    async create() {
        // 创建目录
        await fs.ensureDirSync(this.destDir);
        // 询问
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "namespace",
                    message: "请输入你的项目命名空间",
                    default: "",
                },
                {
                    type: "input",
                    name: "description",
                    message: "请输入你的项目描述",
                    default: "",
                },
                {
                    type: "input",
                    name: "author",
                    message: "请输入作者名称",
                    default: "",
                },
                {
                    type: "input",
                    name: "email",
                    message: "请输入作者的Email",
                    default: "",
                },
                {
                    type: "input",
                    name: "license",
                    message: "许可证",
                    default: "MIT",
                },
            ])
            .then((res) => {
             
               console.log('获取到项目的参数：', res)
                console.log(chalk.hex("#ff800").bold("\rc开始创建文件..."));

                // 终端加载loading 动画
                const spinner = ora("Downloading...").start();
                const timeStart = new Date().getTime();

                // 参数
                const params = {
                    fullName: res.namespace ? `${res.namespace}/${this.name}` : this.name,
                    ...res,
                };

                // 开始复制模板文件
                this._copyFile(params, async () => {
                    spinner.succeed(chalk.hex("#ff800").bold(`模板文件创建完成！ 耗时${new Date().getTime() - timeStart}秒`));
                    // 安装依赖
                    const installing = ora("安装依赖...").start();

                    const istamp = new Date();

                    const result = spawn("npm", ["install"], { cwd: this.destDir });

                    result.stdout.on("data", (buffer) => {
                        process.stdout.write(chalk.hex("#67c23a").bold(buffer));
                    });

                    result.on("close", (code) => {
                        if (code !== 0) {
                            console.log("安装依赖发生错误");
                            process.exit(1);
                        } else {
                            console.log(chalk.hex("#67c23a").bold(`\r\nInstall finished  耗时${new Date() - istamp}ms`));
                        }

                        installing.stop();

                        console.log(chalk.hex("#ff8800").bold(`\r\ncd ${this.name}`));
                        console.log(chalk.hex("#ff8800").bold("\rnpm run dev"));
                    });
                });
            });
    }
}

module.exports = Generator;
