#! /usr/bin/env node

//支持ES6
require('babel-register')
const commander = require('commander')
const ora = require('ora')


const pkg = require('../package.json')
const start = require('./start')
const questionList = require('./questionList')
const copyTemp = require('./copyTemp')
const reviseFile = require('./reviseFile')
const install = require('./install')
const final = require('./final')


/**
 * @description: 初始化默认参数
 * @param {git}: 默认git仓库模板
 * @param {commander}: commander模块
 * @param {spinner}: 安装进度提示工具
 * @param {progress}: 安装进度 默认2 github模板、devDependencies
 * @param {progressCurrent}: 当前进度 默认0 从拉取模板开始增加
 * @param {answers}[Object]: 全部选项答案
 * @param {installBaseType}: 默认包管理器
 * @param {installType}: 命令 = 包管理器名 + 安装dependencies命令
 * @param {installDevType}: 命令 = 包管理器名 + 安装devDependencies命令
 * @param {dependencies}[Array]: 运行依赖
 * @param {devDependencies}[Array]: 开发依赖
 * @param {cssExt}: 样式文件类型
 */

this.commander = commander;
this.version_url = `https://registry.npmjs.org/x-build/latest`;
this.spinner = new ora();
this.progress = 1;
this.progressCurrent = 0;
this.answers = {};
this.installBaseType = '';
this.installType = '';
this.installDevType = '';
this.pkg = pkg;
// this.dependencies = [];
// this.devDependencies = [];
// this.cssExt = '';

// 初始化指令
this.commander
  .version(pkg.version)
  .option('-c, create', '选择一个项目并创建')
  .option('-n, noversion', '禁止版本检测，可能会导致项目无法正常运行！')
  .parse(process.argv);



// 异步函数安装流程
(async function() {
  // 清空控制台，查询CLI版本
  await start(this)
  // 输入问题列表
  await questionList(this);
  // 拷贝模板文件
  await copyTemp(this);
  // 修改项目配置文件
  await reviseFile(this);
  // 安装项目依赖
  await install(this);
  // 最后操作以及提示
  await final(this);
}).call(this);
