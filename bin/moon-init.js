const fs = require('fs-extra');
const core = require('jhipster-core');
const parse = core.parse;
const path = require('path');
const logger = require('../lib/logger');
const utils = require('../lib/utils');
const program = require('commander');
const CWD = process.cwd();
program
  .usage('<path>')
  .option('-p, --jdlpath <string>', 'jdl file or jdl dir path')
  .parse(process.argv)


/**
 * 生成实体
 * @param jdl 
 */
function generateEntities(jdl) {
  const entityTpl = require('../template/entity');
  const hookTpl = require('../template/hook');
  jdl.entities.forEach(entity => {
    const entityTemplate = entityTpl.generateEntity(entity);
    const hookTemplate = hookTpl.generateHook(entity);
    logger.info('generate file', path.join(CWD, '../entities', `${entity.name}.g.ts`));
    logger.info('generate file', path.join(CWD, '../hook', `${entity.name}.hook.g.js`));
    fs.writeFileSync(path.join(CWD, '/entities/', `${entity.name}.g.ts`), entityTemplate);
    fs.writeFileSync(path.join(CWD, '/hook/', `${entity.name}.hook.g.js`), hookTemplate);
  });
}

/**
 * 入口函数
 */
function main(jdlpath) {
  if (!fs.existsSync(path.join(CWD, '/entities'))) fs.mkdirSync(path.join(CWD, '/entities'));
  if (!fs.existsSync(path.join(CWD, '/hook'))) fs.mkdirSync(path.join(CWD, '/hook'));
  if (fs.statSync(jdlpath).isDirectory()) {
    let dirs = utils.readJDLDir(path.join(CWD, jdlpath));
    dirs.map(fileName => {
      let jdl = utils.readJDLFile(path.join(CWD, jdlpath, fileName));
      generateEntities(jdl);
    });
  }
  if (fs.statSync(jdlpath).isFile()) {
    let jdl = utils.readJDLFile(path.join(CWD, jdlpath));
    generateEntities(jdl);
  }
  
}

if (program.jdlpath) main(program.jdlpath);