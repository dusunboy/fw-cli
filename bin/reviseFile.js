import fs from "fs-extra"
import chalk from "chalk"

/**
 * 修改新生成项目的一些基本配置
 * @param {*} that 
 */
const reviseFile = (that) => {
  let path = `${process.cwd()}/${that.answers.name}`;
  return new Promise((resolve, reject) => {
    if (that.answers.project == 'MyMiniprogramFramework') {
      reviseMyMiniprogramFramework(that, path).then((res) => {
        resolve()
      }).catch((error) => {
        reject()
      })
    }
  })
}

/**
 * 修改小程序框架配置文件
 * @param {*} that 
 * @param {*} path 
 */
const reviseMyMiniprogramFramework = (that, path) => {
  return new Promise((resolve, reject) => {
    let _path = path + '/package.json';
    fs.readFile(_path, (err, data) => {
      if (err) reject(err);
      let _data = JSON.parse(data.toString());
      _data.author = '';
      _data.description = '小程序轻量级框架';
      _data.name = that.answers.name;
      that.dependencies = _data.dependencies
      that.devDependencies = _data.devDependencies
      _data = JSON.stringify(_data, null, 4);
      fs.writeFile(_path, _data, error => (error ? reject(error) : resolve()));
    });
  })
}
  
module.exports = reviseFile;
