import os from "os"
import nodeCmd from "node-cmd"

/**
 * @description: 使用 cmd 安装项目依赖
 */
function install(that) {
  return new Promise(resolve => {
    if (that.answers.project == 'MyMiniprogramFramework') {
      let cmdStr = that.installBaseType;
      cmd([`cd ${that.answers.name}`, cmdStr]).then(() => {
        resolve()
        // if (tmpDependencies.length > 0) {
        //   cmdStr = that.installType + ' ' + tmpDependencies.join(' ')
        //   cmd([`cd ${that.answers.name}`, cmdStr]).then(() => {
        //     resolve()
        //   }).catch(error => {
        //     reject(error)
        //   })
        // }
      }).catch(error => {
        reject(error)
      })
    }
  });
}

/**
 * @description: 兼容 windows & mac 命令执行
 * @param {arr}[Array]: 数组值为要执行的命令
 * @return {Promise}
 */
const cmd = (arr) => {
  return new Promise((resolve, reject) => {
    let cmdStr = checkOS(arr, os.type());
    nodeCmd.get(cmdStr, err => {
      err ? reject(err) : resolve(cmdStr);
    });
  });
}

/**
 * 检查OS环境
 * @param {*} arr 
 * @param {*} osType 
 */
const checkOS = (arr, osType) => {
  let result = '';
  if (osType === 'Windows_NT') {
    arr.forEach((item, index) => {
      index === 0 ? result += item : result = result + ' & ' + item;
    });
  } else {
    arr.forEach((item, index) => {
      index === 0 ? result += item : result = result + '\n' + item;
    });
  }
  return result;
}


module.exports = install;
