const fs = require('fs');

fs.readdir('./public', (err, files)=>{
    console.log(files);
    console.log('文件数量：', files.length);
    
})