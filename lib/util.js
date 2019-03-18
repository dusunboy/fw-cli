import chalk from "chalk"
import readline from "readline"
import request  from "request"
import pkg from "../package.json"
import semver from "semver"
import child_process from "child_process"


/**
 * @description: 控制台清空，并输出提示信息
 * @param {color}[String]: 输出信息颜色 
 * @param {str}[String]: 输出信息
 */
const clearConsole = (color, str) => {
  // if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank); // eslint-disable-line
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    console.info(chalk[color](str)); // eslint-disable-line
  // }
}

/**
 * @description: getVersion 获取最新版本号，使用 semver 比较本地与 npmjs.org 版本
 * @return {Promise}: 如果是最新版本 resolve()， 否则 reject()，并返回最新版本号
 */
const checkVersion = (that) => {
  return new Promise((resolve, reject) => {
    getVersion(that.version_url).then(version => {
      semver.lte(version, pkg.version) ? resolve() : reject(version);
    }, error => {
      msg.fail(that.spinner, '网络错误:' + error.message);
      process.exit();
    });
  });
}

/**
 * @description: 通过 npmjs.org api 获取 x-build-cli 最新版本号
 * @param {url}[String]: npmjs.org api 地址
 * @return {Promise}: 如果访问成功，返回版本号
 */
const getVersion = (url) => {
  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      if (!error && response.statusCode === 200){
        resolve(JSON.parse(body).version);
      } else {
        reject(error)
      }
    });
  });
}

/**
 * @description: 返回一个用于输出信息对象
 * @function line(): 输出终端宽度一半的横线
 * @function print(color,text,br): 输出信息，参数color：颜色，text：输出信息，br(可选 top or bottom)：上下输出空行
 * @function docs(): 输出文档信息
 * @function issues(): 输出问题留言
 * @function fail(spinner,str,err): 输出报错信息
 */

const msg = {
  line: () => {
    console.info();
    console.info(chalk.gray('-'.repeat(process.stdout.columns / 2)));
    console.info();
  },
  print: (color, text, br) => {
    if (br === 'top') {
      console.info();
    }
    console.info(chalk[color](text));
    if (br === 'bottom') {
      console.info();
    }
  },
  docs: () => {
    console.info(chalk.green(' [开发文档] https://codexu.github.io/'));
  },
  issues: () => {
    console.info(chalk.green('[问题留言] https://github.com/codexu/x-build/issues'));
  },
  fail: (spinner, str, err) => {
    spinner.fail([chalk.bgRed(str)]);
    console.info('');
    if (err) {
      console.error(err);
      console.info('');
    }
    console.info(chalk.blue('[问题留言] https://github.com/codexu/x-build/issues'));
    process.exit();
  }
};

/**
 * @description: 检测包管理器 优先级 yarn > cnpm > npm
 * @return {String}
 */
const hasYarn = () => {
  let _hasYarn = '';
  try {
    child_process.execSync('yarnpkg --version', { stdio: 'ignore' });
    return (_hasYarn = 'yarn');
  } catch (e) {
    try {
      child_process.execSync('cnpm --version', { stdio: 'ignore' });
      return (_hasYarn = 'cnpm');
    } catch (e) {
      return (_hasYarn = 'npm');
    }
  }
}

module.exports = {
  clearConsole: clearConsole,
  checkVersion: checkVersion,
  msg: msg,
  hasYarn: hasYarn,
}
