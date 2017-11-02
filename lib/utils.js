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
  const data = fs.readFileSync(targetPath).toString();
  return parse(data);
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


