#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const util = require('../lib/utils');
const logger = require('../lib/logger');
const path = require('path');
const cwd = process.cwd();

program
  .usage('<config-path>')
  .option('-c, --configpath <string>', 'ui config file path')
  .parse(process.argv)

const configPath = program.configpath;

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
  fs.writeFileSync(path.join(cwd, `${componentName}.g.vue`), vueComponent);
  logger.info(formTpl.generateForm(UIConfig.form));
}

/**
 * 入口函数
 * @param UIConfigPath 
 */
function run(UIConfigPath) {
  if (UIConfigPath && fs.existsSync(path.join(cwd, UIConfigPath))) {
    if (fs.statSync(path.join(cwd, UIConfigPath)).isFile()) {
      const UIConfig = JSON.parse(fs.readFileSync(path.join(cwd, UIConfigPath)).toString());
      const UIConfigFileName = UIConfigPath.replace(/(.*\/)*([^.]+).*/ig,"$2");
      generateVueComponent(UIConfig, UIConfigFileName);
    } else {
      logger.warn('please provide a valide file');
    }
  }
}

if (configPath) run(configPath);
