import util from "../lib/util.js"

/**
 * @description: 清空控制台 > 版本验证
 * @return {Promise}
 */
const start = (that) => {
  return new Promise(resolve => {
    // 清空控制台，并输出版本信息
    util.clearConsole('magenta', `${that.pkg.name} v${that.pkg.version}`);
    // 检测是否为最新版本
    if (that.commander.noversion){
      resolve();
    } else {
      that.spinner.start('正在查询' + that.pkg.name + '最新版本');
      util.checkVersion(that).then(() => {        
        resolve();
      }, version => {
        util.msg.fail(that.spinner, `请将${that.pkg.name}更新到最新版本(v${version})`);
        process.exit();
      }).finally(() => {
        that.spinner.stop();
      });
    }
  })
}

module.exports = start;
