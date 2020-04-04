#! /usr/bin/env node

'use strict';

//支持ES6

require('babel-register');
var commander = require('commander');
var ora = require('ora');

var pkg = require('../package.json');
var start = require('./start');
var questionList = require('./questionList');
var copyTemp = require('./copyTemp');
var reviseFile = require('./reviseFile');
var install = require('./install');
var final = require('./final');

/**
 * @description: 初始化默认参数
 * @param {git}: 默认git仓库模板
 * @param {commander}: commander模块
 * @param {spinner}: 安装进度提示工具
 * @param {answers}[Object]: 全部选项答案
 * @param {installBaseType}: 默认包管理器
 * @param {installType}: 命令 = 包管理器名 + 安装dependencies命令
 * @param {installDevType}: 命令 = 包管理器名 + 安装devDependencies命令
 * @param {pkg}: 项目配置文件
 */

let localData = {}
localData.version_url = 'https://registry.npmjs.org/fw-cli/latest';
localData.commander = commander;
localData.pkg = pkg;
localData.spinner = new ora();
localData.answers = {};
localData.installBaseType = '';
localData.installType = '';
localData.installDevType = '';

// 初始化指令
localData.commander.version(localData.pkg.version).option('-c, create', '选择一个项目并创建').option('-n, noversion', '禁止版本检测，可能会导致项目无法正常运行！').parse(process.argv);

// 异步函数安装流程
(async function () {
  // 清空控制台，查询CLI版本
  await start(localData);
  // 输入问题列表
  await questionList(localData);
  // 拷贝模板文件
  await copyTemp(localData);
  // 修改项目配置文件
  await reviseFile(localData);
  // 安装项目依赖
  await install(localData);
  // 最后操作以及提示
  await final(localData);
}).call(this);