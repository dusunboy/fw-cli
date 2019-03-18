import util from "../lib/util.js"
import chalk from "chalk"


const msg = util.msg

const final = (that) => {
  that.spinner.succeed([chalk.green(`全部依赖安装完成。`)]);
  let doc = ''
  if (that.answers.project == 'MyMiniprogramFramework') {
    doc = 'https://github.com/dusunboy/MyMiniprogramFramework'
  }
  setTimeout(() => {
    msg.line();
    msg.print('green', `🎉  欢迎使用${that.answers.project}, 如有什么疑问可以查看`, 'bottom');
    // msg.print('cyan', ` $ cd ${that.answers.name}`);
    msg.print('green', ` ${doc}`);
    process.exit();
  }, 500)
}

module.exports = final;
