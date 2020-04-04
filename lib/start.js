import util from "./utils"

const msg = util.msg

/**
 * @description: 清空控制台 > 版本验证
 * @return {Promise}
 */
const start = (that) => {
  return new Promise(resolve => {
    // 清空控制台，并输出版本信息
    util.clearConsole('magenta', `${that.pkg.name} v${that.pkg.version}`);
    // 检测是否为最新版本
    if (that.commander.noversion) {
      resolve();
    } if (that.commander.create){      
      that.spinner.start('正在查询' + that.pkg.name + '最新版本');
      util.checkVersion(that).then(() => {        
        resolve();
      }, version => {
        msg.fail(that.spinner, `请将${that.pkg.name}更新到最新版本(v${version}) npm update -g fw-cli`);
        process.exit();
      }).finally(() => {
        that.spinner.stop();
      });
    } else {
      msg.print('red', `无效命令`);
      msg.print('blue', `请输入 fw-cli -h 查询有效命令`);
      process.exit();
    }
  })
}

module.exports = start;
