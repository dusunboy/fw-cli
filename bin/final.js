import util from "../lib/util.js"
import chalk from "chalk"


const msg = util.msg

const final = (that) => {
  let doc = ''
  if (that.answers.project == 'MyMiniprogramFramework') {
    doc = 'https://github.com/dusunboy/MyMiniprogramFramework'
    that.spinner.succeed([chalk.green(`全部依赖安装完成。`)]);
  } else if (that.answers.project == 'MyFlaskReact') {
    doc = 'https://github.com/dusunboy/MyFlaskReact'
    that.spinner.succeed([chalk.green(`全部依赖安装完成。`)]);
  } else if (that.answers.project == 'MyAndroidMVPTemplates') {
    doc = 'https://github.com/dusunboy/MyAndroidMVPTemplates'
    that.spinner.succeed([chalk.green(`生成项目完成。`)]);
  }
  if (typeof(that.answers.moduleName) != "undefined" && that.answers.moduleName != '') {
    msg.print('green', `生成的项目目录 /${that.answers.moduleName}`);
  } else {
    msg.print('green', `生成的项目目录 /${that.answers.name}`);
  }
  setTimeout(() => {
    msg.line();
    msg.print('green', `🎉  欢迎使用${that.answers.project}框架, 更多详情查看`, 'bottom');
    msg.print('green', `   ${doc}`);
    process.exit();
  }, 500)
}

module.exports = final;

