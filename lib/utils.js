const fs = require('fs-extra');
const core = require('jhipster-core');
const parse = core.parse;
const path = require('path');
const ora = require('ora')
const download = require('download-git-repo');
const logger = require('./logger');
/**
 * 读取JDL文件
 * @param targetPath JDL文件路径
 * @returns { JSON }
 */
module.exports.readJDLFile = function readJDLFile(targetPath) {
  const jdl = fs.readFileSync(targetPath).toString();
  const jdlFilter = jdl.replace(/->/g, '__') // JDL不支持特殊符号
    .replace(/(^enum\b.*\{\n)([\s\S]*)(\}\n)/gm, jdl.match(/(^enum\b.*\{\n)([\s\S]*)(\}\n)/gm)[0].replace(/\/\*{2}.*\*\/\n/gm, '')) // 删除enum的注释（JDL格式化不支持注释）
    .replace(/(STATEMACHINE)(\b)*(.*)(\b)*\{/g, 'entity$3_$1{'); // 状态机改为entity （因JDL不支持状态机 伪扩展）
  // todo 支持enum注释
  return parse(jdlFilter);
  
}

/**
 * 读取文件目录
 * @param targetPath 
 * @returns 
 */
module.exports.readJDLDir = function readJDLDir(targetPath) {
  return fs.readdirSync(targetPath);
}

/**
 * 下载文件
 * @param repPath git项目路径
 * @param targetPath 下载存放路径
 * @returns {Promise}
 */
module.exports.downloadGitRep = function (repPath, targetPath) {
  return new Promise((resolve, reject) => {
    const spinner = ora('download template');
    spinner.start();
    download(repPath, targetPath, function (err) {
      spinner.stop();
      if (err) {
        logger.error(err.message);
        reject(err.message);
      } else {
        resolve();
      }
    });
  })
}