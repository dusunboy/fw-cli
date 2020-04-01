import fs from "fs-extra"
import util from "../lib/util.js"
import moment from "moment"
import path from "path"

const msg = util.msg

/**
 * 修改新生成项目的一些基本配置
 * @param {*} that 
 */
const reviseFile = (that) => {
  return new Promise((resolve, reject) => {
    let _path = ''
    if (typeof(that.answers.moduleName) != "undefined" && that.answers.moduleName != '') {
      _path = path.join(process.cwd(), that.answers.moduleName)
    } else {
      _path = path.join(process.cwd(), that.answers.name)
    }
    if (that.answers.project == 'MyMiniprogramFramework') {
      reviseMyMiniprogramFramework(that, _path).then((res) => {
        resolve()
      }).catch((error) => {
        msg.fail(that.spinner, '生成项目失败！', error);
        reject(error)
      })
    } else if (that.answers.project == 'MyFlaskReact') {
      reviseMyFlaskReact(that, _path).then((res) => {
        resolve()
      }).catch((error) => {
        msg.fail(that.spinner, '生成项目失败！', error);
        reject(error)
      })
    } else if (that.answers.project == 'MyAndroidMVPTemplates') {
      reviseMyAndroidMVPTemplates(that, _path).then((res) => {
        resolve()
      }).catch((error) => {
        msg.fail(that.spinner, '生成项目失败！', error);
        reject(error)
      })
    }
  })
}

/**
 * 修改小程序框架配置文件
 * @param {*} that 
 * @param {*} _path 
 */
const reviseMyMiniprogramFramework = (that, _path) => {
  return new Promise((resolve, reject) => {
    // fs.readFile(_path, (err, data) => {
      //   if (err) reject(err);
      //   let _data = JSON.parse(data.toString());
      //   _data.author = '';
      //   _data.description = '小程序轻量级框架';
      //   _data.name = that.answers.name.toLowerCase()
      //   _data = JSON.stringify(_data, null, 4);
      // });
      // fs.writeFile(_path, _data, error => (error ? reject(error) : resolve()));
    let path = _path + '/package.json';
    let data = fs.readFileSync(path)
    let _data = JSON.parse(data.toString());
    _data.author = '';
    _data.description = '小程序轻量级框架';
    _data.name = that.answers.name.toLowerCase()
    _data = JSON.stringify(_data, null, 4);
    fs.writeFileSync(path, _data)
    path = _path + '/project.config.json';
    data = fs.readFileSync(path)
    _data = JSON.parse(data.toString());
    _data.projectname = that.answers.name
    _data = JSON.stringify(_data, null, 4);
    fs.writeFileSync(path, _data)
    resolve()

  })
}

/**
 * 修改Flask + React配置文件
 * @param {*} that 
 * @param {*} _path 
 */
const reviseMyFlaskReact = (that, _path) => {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

/**
 *  修改AndroidDagger2MVP框架模板和项目框架
 * @param {*} that 
 * @param {*} _path 
 */
const reviseMyAndroidMVPTemplates = (that, _path) => {
  return new Promise((resolve, reject) => {
    let files = fs.readdirSync(_path)
    for (let index = 0; index < files.length; index++) {
      let filePath = path.join(_path, files[index])
      let stats = fs.statSync(filePath)
      if(stats.isFile()){
        let data = fs.readFileSync(filePath)
        let _data = data.toString()
        if (that.answers.myAndroidMVPStyle == 1) {
          _data = _data.replace(/\$Project/g, that.answers.name)
        } else {
          _data = _data.replace(/\$Name/g, that.answers.name)
            .replace(/\$ModuleName/g, that.answers.moduleName)
            .replace(/\$LowerNameCase/g, 
              that.answers.name.substring(0, 1).toLowerCase() + that.answers.name.substring(1))
        }
        _data = _data.replace(/\$Package/g, that.answers.package)
          .replace(/\$Time/g, moment().format('YYYY-MM-DD HH:mm:ss'))
        fs.writeFileSync(filePath, _data)
        if (that.answers.myAndroidMVPStyle != 1) {
          fs.renameSync(filePath, filePath.replace('Dagger2', that.answers.name)) 
        }
      } else if(stats.isDirectory()){
        reviseMyAndroidMVPTemplates(that, filePath)
      }
    }
    resolve()
  })
    
}
  
module.exports = reviseFile;
