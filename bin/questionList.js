import inquirer from "inquirer"
import util from "../lib/util.js"


const msg = util.msg
const hasYarn = util.hasYarn


// 问题选择
const question = {
  project: {
    type: 'rawlist',
    message: `选择要创建的项目框架`,
    name: 'project',
    choices: ['MyMiniprogramFramework',]
  },
  name: {
    type: 'input',
    message: `请输入项目名称`,
    name: 'name',
    validate: (input) => {
      if (input == '') {
        return '项目名称不能为空';
      } else {
        return true
      }
    }
  },
};

/**
 * @description: 问题输入列表
 */
const questionList = (that) => {
  return new Promise(resolve => {
    // 使用create命令时
    if (that.commander.create) {
      // 判断包管理器 优先级 yarn > cnpm > npm
      that.answers.package_manager = hasYarn();
      // 提示问题选项
      inquirer.prompt([
        question.project,
        question.name,
      ]).then(answers => {
        // 选项赋值
        that.answers.project = answers.project;
        that.answers.name = answers.name;

        // 选项完成后设置基本参数
        setParam(that);
        msg.line();
        resolve();
      })
    }
  });
}

/**
 * @description: 通过命令选择，初始化参数信息
 */
const setParam = (that) => {  
  switch (that.answers.package_manager) {
    case 'npm':
      that.installBaseType = 'npm install';
      that.installType = 'npm install --save ';
      that.installDevType = 'npm install --save-dev';
      break;
    case 'cnpm':
      that.installBaseType = 'cnpm install';
      that.installType = 'cnpm install --save ';
      that.installDevType = 'cnpm install --save-dev';
      break;
    default:
      that.installBaseType = 'yarn';
      that.installType = 'yarn add ';
      that.installDevType = 'yarn add -D ';
      break;
  }
}



module.exports = questionList;
