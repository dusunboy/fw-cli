import inquirer from 'inquirer'
import util from '../lib/util.js'
import chalk from "chalk"

const msg = util.msg
const hasYarn = util.hasYarn

// 问题选择
const question = {
  project: {
    type: 'rawlist',
    message: `选择要创建的项目框架`,
    name: 'project',
    choices: ['MyMiniprogramFramework', 'MyFlaskReact', 'MyAndroidMVPTemplates']
  },
  name: {
    type: 'input',
    message: `请输入项目名称`,
    name: 'name',
    validate: input => {
      if (input == '') {
        return '项目名称不能为空'
      } else {
        return true
      }
    }
  },
  myAndroidMVPStyle: {
    type: 'rawlist',
    message: `选择生成的方式`,
    name: 'myAndroidMVPStyle',
    choices: ['框架生成', 'Dagger2 MVP模块生成'],
    filter: (val) => {
      if (val == '框架生成') {
        return 1
      } else {
        return 2
      }
    }
  },
  myAndroidProjectName: {
    type: 'input',
    message: `请输入项目名称和包名(格式:项目名${chalk.red(`[驼峰写法]`)},包名)：`,
    name: 'myAndroidProjectName',
    validate: input => {
      let inputs = input.split(',')
      if (inputs.length != 2) {
        return `输入格式不正确!请重新输入(格式:项目名${chalk.red(`[驼峰写法]`)},包名)：`
      } else {
        if (inputs[0].length > 0 &&  inputs[1].length > 0) {
          return true
        } else {
          return '项目名或包名不能输入空字符串'
        }
      }
    }
  },
  myAndroidModuleName: {
    type: 'input',
    message: `请输入MVP模块名称和包名(格式:模块名${chalk.red(`[驼峰写法]`)},包名)：`,
    name: 'myAndroidModuleName',
    validate: input => {
      let inputs = input.split(',')
      if (inputs.length != 2) {
        return `输入格式不正确!请重新输入(格式:模块名${chalk.red(`[驼峰写法]`)},包名)`
      } else {
        if (inputs[0].length > 0 &&  inputs[1].length > 0) {
          return true
        } else {
          return '模块名或包名不能输入空字符串'
        }
      }
    }
  },
  myAndroidMVPModule: {
    type: 'rawlist',
    message: `请输入数字选择`,
    name: 'myAndroidMVPModule',
    choices: ['生成Activity', 'Dagger2 生成Fragment'],
    filter: (val) => {
      if (val == '生成Activity') {
        return 1
      } else {
        return 2
      }
    }
  }
}

/**
 * @description: 问题输入列表
 */
const questionList = that => {
  return new Promise(resolve => {
    // 使用create命令时
    if (that.commander.create) {
      // 判断包管理器 优先级 yarn > cnpm > npm
      that.answers.package_manager = hasYarn()
      setParam(that)

      inquirer
        .prompt([question.project])
        .then(answers => {
          that.answers.project = answers.project
          return new Promise((resolve1, reject1) => {
            if (that.answers.project == 'MyAndroidMVPTemplates') {
              inquirer.prompt([question.myAndroidMVPStyle]).then(answers => {
                that.answers.myAndroidMVPStyle = answers.myAndroidMVPStyle
                resolve1(true)
              })
            } else {
              inquirer.prompt([question.name]).then(answers => {
                that.answers.name = answers.name
                resolve1(false)
              })
            }
          })
        })
        .then(isContinue => {
          if (isContinue) {
            return new Promise((resolve1, reject1) => {
              if (that.answers.myAndroidMVPStyle == 1) {
                inquirer
                  .prompt([question.myAndroidProjectName])
                  .then(answers => {
                    let myAndroidProjectNames = answers.myAndroidProjectName.split(
                      ','
                    )
                    that.answers.name = myAndroidProjectNames[0].trim()
                    that.answers.package = myAndroidProjectNames[1].trim()
                    resolve1(false)
                  })
              } else {
                inquirer.prompt([question.myAndroidMVPModule]).then(answers => {
                  that.answers.myAndroidMVPModule = answers.myAndroidMVPModule
                  resolve1(true)
                })
              }
            })
          }
        })
        .then(isContinue => {
          if (isContinue) {
            return new Promise((resolve1, reject1) => {
              inquirer.prompt([question.myAndroidModuleName]).then(answers => {
                let myAndroidModuleNames = answers.myAndroidModuleName.split(',')
                that.answers.name = myAndroidModuleNames[0].trim()
                that.answers.package = myAndroidModuleNames[1].trim()
                resolve1(false)
              })
            })
            
          }
        })
        .finally(() => {
          msg.line()
          resolve()
        })
    }
  })
}

/**
 * @description: 通过命令选择，初始化参数信息
 */
const setParam = that => {
  switch (that.answers.package_manager) {
    case 'npm':
      that.installBaseType = 'npm install'
      that.installType = 'npm install --save '
      that.installDevType = 'npm install --save-dev'
      break
    case 'cnpm':
      that.installBaseType = 'cnpm install'
      that.installType = 'cnpm install --save '
      that.installDevType = 'cnpm install --save-dev'
      break
    default:
      that.installBaseType = 'yarn'
      that.installType = 'yarn add '
      that.installDevType = 'yarn add -D '
      break
  }
}

module.exports = questionList
