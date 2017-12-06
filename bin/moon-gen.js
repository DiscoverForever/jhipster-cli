#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const util = require('../lib/utils');
const logger = require('../lib/logger');
const path = require('path');
const inquirer = require('inquirer');
const cwd = process.cwd();

program
  .usage('<config-path>')
  .option('-c, --configpath <string>', 'ui config file path')
  .option('-r, --componentpath <string>', 'component dir path')
  .parse(process.argv)

const configPath = program.configpath;
const componentPath = program.componentpath;

/**
 * 生成vue component
 * 
 * @param UIConfig UI配置文件
 * @param componentName UI配置文件名称(组件名称)
 */
function generateVueComponent(UIConfig, componentName) {
  logger.info(UIConfig);
  const formTpl = require('../template/form');
  const vueComponent = formTpl.generateForm(UIConfig.form);
  fs.writeFileSync(path.join(cwd, `${componentName}-detail.g.vue`), vueComponent);
  logger.info(formTpl.generateForm(UIConfig.form));
}

/**
 * 生成路由
 * @param dirPath
 */
async function generateVueRouter(dirPath) {
  let vueFileList = getDirFilePath(path.join(cwd, dirPath));
  let routes = vueFileList.map(({
    filePath,
    fileName
  }) => {
    return {
      path: filePath.split('components')[1],
      name: filePath.split('components')[1].substr(1),
      meta: {
        login: true,
        keepAlive: false
      },
      component: `() => import('../components${filePath.split('components')[1]}')`
    };
  });
  let answers = await inquirer.prompt([{
    type: 'input',
    message: 'Please enter your router directory',
    name: 'routeDir'
  }]);
  answers.routeDir ? fs.writeFileSync(path.join(cwd, answers.routeDir, 'router.g.js'), `export default ${JSON.stringify(routes).replace(/"\(/g, '(').replace(/\)"/g, ')')}`) :logger.error('Your input not vaild');
}
// todo 循环遍历*.vue文件
function getDirFilePath(dir) {
  let fileList = [];

  function walk(dirPath) {
    if (!fs.existsSync(dirPath)) throw new Error('dirPath does not exist');
    if (fs.statSync(dirPath).isDirectory()) {
      fs.readdirSync(dirPath).forEach((sonDir) => walk(path.join(dirPath, sonDir)));
    } else if (fs.statSync(dirPath).isFile() && dirPath.endsWith('.vue')) {
      fileList.push({
        filePath: dirPath,
        fileName: dirPath.substr(dirPath.lastIndexOf('/') + 1)
      });
    }
  }
  walk(dir);
  return (fileList);
}

/**
 * 入口函数
 * @param UIConfigPath 
 */
function run(UIConfigPath) {
  if (UIConfigPath && fs.existsSync(path.join(cwd, UIConfigPath))) {
    if (fs.statSync(path.join(cwd, UIConfigPath)).isFile()) {
      const UIConfig = JSON.parse(fs.readFileSync(path.join(cwd, UIConfigPath)).toString());
      const UIConfigFileName = UIConfigPath.replace(/(.*\/)*([^.]+).*/ig, "$2");
      generateVueComponent(UIConfig, UIConfigFileName);
    } else {
      logger.warn('please provide a valide file');
    }
  }
}

if (configPath) run(configPath);
if (componentPath) generateVueRouter(componentPath);