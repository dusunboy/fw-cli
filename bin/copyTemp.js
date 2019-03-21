import util from "../lib/util.js"
import fs from "fs-extra"
import path from "path"
import download from "download-git-repo"
import chalk from "chalk"
import os from "os"

const msg = util.msg
/**
 * @description: 拷贝模版文件
 * @return {Promise}
 */

const copyTemp = (that) => {
  let src = ''
  let dest = ''
  const downloadPath = path.join(os.tmpdir(), 'fw-cli', 'framework', that.answers.project)
  if (that.answers.project == 'MyAndroidMVPTemplates') {
    if (that.answers.myAndroidMVPStyle == 1) {
      //框架生成
      src = path.resolve(__dirname, path.join(downloadPath, 'src',
              'main', 'resources','MyProjectFramework'));
      dest = path.resolve(process.cwd(), that.answers.name)
    } else {
      //Dagger2 MVP模块生成
      if (that.answers.myAndroidMVPModule == 1) {
        //生成Activity
        src = path.resolve(__dirname, path.join(downloadPath, 'src',
                'main', 'resources','dagger2'));
      } else {
        //Dagger2 生成Fragment
        src = path.resolve(__dirname, path.join(downloadPath, 'src',
                'main', 'resources','fragment_dagger2'));
        that.answers.name = 'Fragment' + that.answers.name
      }
      that.answers.moduleName = that.answers.name.replace(/\B([A-Z])/g, '_$1').toLowerCase()      
      dest = path.resolve(process.cwd(),  that.answers.moduleName)   
    }
  } else {
    src = path.resolve(__dirname, path.join(downloadPath))
    dest = path.resolve(process.cwd(), that.answers.name)
  }
  return new Promise(resolve => {
    downloadTemp(that, downloadPath).then(() => {   
      that.spinner.start(`正在生成项目...`);
      fs.copy(src, dest)
        .then(() => {    
          fs.remove(downloadPath)
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
const downloadTemp = (that, downloadPath) => {
  return new Promise((resolve, reject) => {
    that.spinner.start(`正在下载${that.answers.project}源码`);
    let repoUrl = ''
    if (that.answers.project == 'MyMiniprogramFramework') {
      repoUrl = 'dusunboy/MyMiniprogramFramework'
    } else if (that.answers.project == 'MyFlaskReact') {
      repoUrl = 'dusunboy/MyFlaskReact'
    } else if (that.answers.project == 'MyAndroidMVPTemplates') {
      repoUrl = 'dusunboy/MyAndroidMVPTemplates'
    }    
    download(repoUrl, downloadPath, (res) => {
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
