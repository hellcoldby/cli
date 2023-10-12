/*
 *
 *  创建项目和文件
 *  fs.readdir(path, callback) 会读取目录下的所有文件和文件夹。 callback会以数组的形式返回
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
        const {currentPath, rootPath} = params;
        fs.readdir(currentPath, (err, files) => {
            if (err){
                console.log(err);
                throw err;
            }
            let array = files;
            let count = files.length;
            console.log(`\n   开始遍历${chalk.bgRed.bold(`${currentPath}`)}下的文件和目录：`, '共计：', count);
            if(count === 0){
                callback && callback();
                return;
            }
 
            files.forEach((file) => {
                const filePath = path.join(currentPath, file);
                const destPath = path.join(this.destDir, file);
                const stat = fs.statSync(filePath);

                if (stat.isFile()) { 
                   
                    const relativePath = path.relative(rootPath, filePath);
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
                        fs.readFile(filePath, "utf-8", (err, resp) => {
                            if (err) throw err;
                            const outputDir = path.dirname(outputAbsolutePath);
                            if (!fs.existsSync(outputDir)) {
                                // 判断文件夹是否存在，不存在就创建
                                fs.ensureDirSync(outputDir);
                            }
                            fs.writeFileSync(outputAbsolutePath, resp);
                        });
                    }
                  
                   count --;
                   // 从列表中删除文件，只剩下目录
                   array = array.filter(ele=> ele !== file);
                   console.log('文件---遍历计数：', count, ' ：', file);

                   // 如果目录下没有目录就会执行回调
                   if(count === 0){
                       callback();
                   }
                } else {
                    
                    fs.mkdir(destPath, err=>{
                        // console.log('创建目录', destPath)
                        if(err){ return}
                        this._copyFile({...params, currentPath:filePath},()=>{

                            count--;
                            console.log(`\r --- 已完成${chalk.hex('#FFC400')(`${file}`)}的遍历`,  `【${array}】目录计数 - 1`);
                            if(count === 0){
                                callback();
                            }
                        })
                    })
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
                    default: "test",
                },
                {
                    type: "input",
                    name: "description",
                    message: "请输入你的项目描述",
                    default: "test",
                },
                {
                    type: "input",
                    name: "author",
                    message: "请输入作者名称",
                    default: "me",
                },
                {
                    type: "input",
                    name: "email",
                    message: "请输入作者的Email",
                    default: "xxx@email.com",
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
                console.log(chalk.hex("#ff800").bold("\r开始创建文件..."));

                // 终端加载loading 动画
                const spinner = ora("Downloading...").start();
                const timeStart = new Date().getTime();

                // 参数
                const params = {
                    currentPath: this.tmpDir,
                    rootPath: this.tmpDir,
                    fullName: res.namespace ? `${res.namespace}/${this.name}` : this.name,
                    ...res,
                };

                // 开始复制模板文件
                this._copyFile(params, async () => {
                    console.log('执行回调');
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
                        installing.succeed(chalk.bgRed.bold(`\r 依赖安装完成`));
                        installing.stop();
                        installing.succeed(chalk.bgRed.bold(`\r 项目${this.name}创建完成`));
                      
                    });
                });
            });
    }
}

module.exports = Generator;
