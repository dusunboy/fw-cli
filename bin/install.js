import chalk from "chalk"
import os from "os"
import nodeCmd from "node-cmd"

/**
 * @description: 使用 cmd 安装项目依赖
 */
function install(that) {
  // let path = `${process.cwd()}/${that.answers.name}`;
  return new Promise(resolve => {
    if (that.answers.project == 'MyMiniprogramFramework') {
      let dependencies = that.dependencies
      let devDependencies = that.devDependencies
      let tmpDependencies = []
      let tmpDevDependencies = []
      for (let i in dependencies) {
        tmpDependencies.push(i)
      }
      for (let i in devDependencies) {
        tmpDevDependencies.push(i)
      }
      let cmdStr = that.installBaseType;
      let installBase = cmd([`cd ${that.answers.name}`, cmdStr])
      let installDependencies = null
      let installDevDependencies = null
      // if (tmpDependencies.length > 0) {
      //   cmdStr = that.installType + ' ' + tmpDependencies.join(' ')
      //   installDependencies = cmd([`cd ${that.answers.name}`, cmdStr])
      // }
      // if (tmpDevDependencies.length > 0) {
      //   cmdStr = that.installDevType + ' ' + tmpDevDependencies.join(' ');
      //   installDevDependencies = cmd([`cd ${that.answers.name}`, cmdStr])
      // }
      queue([installBase, installDependencies, installDevDependencies])
        .then(data => {
          resolve();
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

// 构建队列
const queue = (arr) => {
  var sequence = Promise.resolve()
  arr.forEach(function (item) {
    sequence = sequence.then(item)
  })
  return sequence
}

module.exports = install;
