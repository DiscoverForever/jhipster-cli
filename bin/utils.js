const fs = require('fs-extra');
const core = require('jhipster-core');
const parse = core.parse;
const path = require('path');

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



