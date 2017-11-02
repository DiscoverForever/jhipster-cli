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
    logger.info(entity)
    const entityTemplate = entityTpl.generateEntity(entity);
    const hookTemplate = hookTpl.generateHook(entity);
    logger.info('generate file', path.join(CWD, 'backend/entities', `${entity.name}.g.ts`));
    logger.info('generate file', path.join(CWD, 'backend/hook', `${entity.name}.hook.g.js`));
    fs.writeFileSync(path.join(CWD, 'frontend/src/components/entities', `${entity.name}.g.ts`), entityTemplate);
    fs.writeFileSync(path.join(CWD, 'backend/entities/', `${entity.name}.g.ts`), entityTemplate);
    fs.writeFileSync(path.join(CWD, 'backend/hook/', `${entity.name}.hook.g.js`), hookTemplate);
  });
}



/**
 * 入口函数
 */
async function main(jdlpath) {
  // download leanengine
  await utils.downloadGitRep('leancloud/node-js-getting-started', path.join(CWD, 'backend'));
  // download vux
  await utils.downloadGitRep('discoverforever/vux-template', path.join(CWD, 'frontend'));

  if (!fs.existsSync(path.join(CWD, 'frontend/src/components/entities'))) fs.mkdirSync(path.join(CWD, 'frontend/src/components/entities'));
  if (!fs.existsSync(path.join(CWD, 'backend/entities'))) fs.mkdirSync(path.join(CWD, 'backend/entities'));
  if (!fs.existsSync(path.join(CWD, 'backend/hook'))) fs.mkdirSync(path.join(CWD, 'backend/hook'));
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