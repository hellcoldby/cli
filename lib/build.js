
/*
 *
 *  创建项目和文件
 * 
 * */ 
const chalk = require("chalk");
const inquirer = require("inquirer");


/**
 * name 项目名称
 * destDir 项目路径
 */
class Generator {
    constructor (name, destDir){
        this.name = name;
        this.destDir = destDir;
    }

    async create(){
        // 创建目录
        await fs.ensureDirSync(this.destDir);
        // 询问
        inquirer.prompt([
            {
                type:'input',
                name:'namespace',
                message: '请输入你的项目命名空间',
                default:'',
            },{
                type:'input',
                name: 'description',
                message: '请输入你的项目描述',
                default:'',
            },{
                type: 'input',
                name: 'author',
                message:'请输入作者名称',
                default:'',
            },{
                type:'input',
                name: 'email',
                message: '请输入作者的Email',
                default:''
            },{
                type:'input',
                name:'许可证',
                message:'License',
                default:'MIT',
            }
        ]).then(res=>{
            // 模版所在目录
            const tmpDir = path.join(__dirname, '../templates');
            console.log(chalk.hex('#ff800').bold('\r\ccreate file start...'));

            // 开始复制文件
            const params = {
                tmpDir,
                destDir:this.destDir,
                fullName: res.namespace? `${res.namespace}/${this.name}` : this.name,
                ...res
            }

            this._copyFile(params, async()=>{
                
            })
        })
    }
}

module.exports = Generator;