const fs = require('fs');
const core = require('jhipster-core');
const parse = core.parse;
const path = require('path');

/**
 * 读取JDL文件
 * @param targetPath JDL文件路径
 * @returns { JSON }
 */
function readJDLFile(targetPath) {
  const data = fs.readFileSync(targetPath).toString();
  return parse(data);
}

/**
 * 读取文件目录
 * @param targetPath 
 * @returns 
 */
function readJDLDir(targetPath) {
  return fs.readdirSync(targetPath);
}

/**
 * 生成实体
 * @param jdl 
 */
function generateEntities (jdl) {
  jdl.entities.forEach(entity => {
    fs.writeFileSync(path.join(__dirname, '../entities', `${entity.name}.js`), entity.name);
  });
}

/**
 * 入口函数
 */
function main() {
  let dirs = readJDLDir(path.join(__dirname, '../dsl'));
  dirs.map(fileName => {
    let jdl = readJDLFile(path.join(__dirname, '../dsl', fileName));
    generateEntities(jdl);
  });
}

main();