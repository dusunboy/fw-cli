import util from "../lib/util.js"
import fs from "fs-extra"
import path from "path"
import download from "download-git-repo"
import chalk from "chalk"

const msg = util.msg

/**
 * @description: 拷贝模版文件
 * @return {Promise}
 */

const copyTemp = (that) => {
  const src = path.resolve(__dirname, `../framework/${that.answers.project}`);
  const dest = path.resolve(process.cwd(), that.answers.name);
  return new Promise(resolve => {
    downloadTemp(that).then(() => {   
      // that.spinner.start(`[${that.progressCurrent}/${that.progress}] 正在拷贝模板文件...`);
      that.spinner.start(`正在生成项目...`);
      fs.copy(src, dest)
        .then(() => {    
          resolve();
        })
        .catch(err => {
          that.spinner.stop()
          msg.fail(that.spinner, '生成项目失败！', err);
          process.exit();
        });
      })
    }, error => {
      util.msg.fail(that.spinner, error);
      process.exit();
    });
    
}

/**
 * 下载项目框架模板
 */
const downloadTemp = (that) => {
  return new Promise((resolve, reject) => {
    that.spinner.start(`正载下载${that.answers.project}源码`);
    let repoUrl = ''
    if (that.answers.project == 'MyMiniprogramFramework') {
      repoUrl = 'dusunboy/MyMiniprogramFramework'
    }
    download(repoUrl, `framework/${that.answers.project}`, (res) => {
      if(!res) {
        // 可以输出一些项目成功的信息
        that.spinner.succeed([chalk.green(`下载成功`)]);
        resolve()
      } else {
        // 可以输出一些项目失败的信息
        msg.fail(that.spinner, '下载失败', res);
        that.spinner.stop()
        reject()
      }
    })
  })
  
}

module.exports = copyTemp;
