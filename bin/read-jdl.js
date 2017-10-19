const fs = require('fs-extra');
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
  const entityTpl = require('../template/entity');
  const hookTpl = require('../template/hook');
  jdl.entities.forEach(entity => {
    const entityTemplate = entityTpl.generateEntity(entity);
    const hookTemplate = hookTpl.generateHook(entity);
    console.log(new Date().toLocaleString(),'generate file', path.join(__dirname, '../entities', `${entity.name}.g.ts`));
    console.log(new Date().toLocaleString(),'generate file', path.join(__dirname, '../hook', `${entity.name}.hook.g.js`));
    fs.writeFileSync(path.join(__dirname, '../entities', `${entity.name}.g.ts`), entityTemplate);
    fs.writeFileSync(path.join(__dirname, '../hook', `${entity.name}.hook.g.js`), hookTemplate);
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