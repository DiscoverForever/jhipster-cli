const fs = require('fs-extra');
const core = require('jhipster-core');
const parse = core.parse;
const path = require('path');
const logger = require('../lib/logger');
const utils = require('../lib/utils');
const program = require('commander');
const spawn = require('child_process').spawn;
const CWD = process.cwd();
const inquirer = require('inquirer');
const ejs = require('ejs');
const querystring = require('querystring');
const {
  execSync
} = require('child_process');

program
  .usage('<path>')
  .option('-p, --jdlpath <string>', 'jdl file or jdl dir path')
  .parse(process.argv)


/**
 * 生成实体
 * @param jdl 
 */
function generateEntities(jdl) {
  const uiMetaTpl = require('../template/ui.meta');
  jdl.entities.forEach(entity => {
    if (!entity.name.startsWith('STATEMACHINE')) {
      logger.info(JSON.stringify(jdl))
      const uiMetaTemplate = uiMetaTpl.generateUiMeta(entity, jdl.enums);
      logger.info('generate file', path.join(CWD, 'backend/entities', `${entity.name}.g.ts`));
      logger.info('generate file', path.join(CWD, 'backend/hook', `${entity.name}.hook.g.js`));
      fs.outputFileSync(path.join(CWD, `frontend/src/components/entities/${entity.name}`, `${entity.name}.ui.meta.json`), uiMetaTemplate);
      ejs.renderFile(path.join(__dirname, '..', 'template/table.vue'), {entity}, (err, str) => {
        fs.outputFileSync(path.join(CWD, `frontend/src/components/entities/${entity.name}`, `${entity.name}.g.vue`), str);
      });
      ejs.renderFile(path.join(__dirname, '..', 'template/table-add.g.vue'), {entity}, (err, str) => {
        fs.outputFileSync(path.join(CWD, `frontend/src/components/entities/${entity.name}`, `${entity.name}-add.g.vue`), str);
      });
      ejs.renderFile(path.join(__dirname, '..', 'template/table-edit.g.vue'), {entity}, (err, str) => {
        fs.outputFileSync(path.join(CWD, `frontend/src/components/entities/${entity.name}`, `${entity.name}-edit.g.vue`), str);
      });
      ejs.renderFile(path.join(__dirname, '..', 'template/entity.ts'), {entity}, (err, str) => {
        fs.outputFileSync(path.join(CWD, `frontend/src/components/entities/${entity.name}`, `${entity.name}.g.ts`), str);
      });
      ejs.renderFile(path.join(__dirname, '..', 'template/hook.js'), {entities: jdl.entities, state: jdl.enums.find(item => item.name==='State'), ACL: querystring.parse(entity.javadoc.split('?')[1]).ACL}, (err, str) => {
        fs.outputFileSync(path.join(CWD, `backend/hook/${entity.name}`, `${entity.name}.hook.g.js`), str);
      });
      ejs.renderFile(path.join(__dirname, '..', 'template/hook.g.js'), {entities: jdl.entities, state: jdl.enums.find(item => item.name==='State'), ACL: querystring.parse(entity.javadoc.split('?')[1]).ACL}, (err, str) => {
        fs.outputFileSync(path.join(CWD, `backend/hook/${entity.name}`, `${entity.name}.g.js`), str);
      });
      ejs.renderFile(path.join(__dirname, '..', 'template/hook.ex.js'), {entities: jdl.entities, state: jdl.enums.find(item => item.name==='State'), ACL: querystring.parse(entity.javadoc.split('?')[1]).ACL}, (err, str) => {
        fs.outputFileSync(path.join(CWD, `backend/hook/${entity.name}`, `${entity.name}.ex.js`), str);
      });
      fs.outputFileSync(path.join(CWD, 'uimeta/', `${entity.name}.ui.meta.json`), uiMetaTemplate);

      generateEntityComponent(`${entity.name}.ui.meta.json`, path.join(CWD, `frontend/src/components/entities/${entity.name}`));
    }
    
  });
}

function generateEntityComponent(uiMetaName, uiMetaPath) {
  logger.info(uiMetaPath);
  const child = spawn('moon', ['generate', '-c', uiMetaName], {
    cwd: uiMetaPath
  });
  process.stdin.pipe(child.stdin);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

}

function generateBackend() {
  execSync('lean login', {
    stdio: [1, 2, 3]
  });
  execSync('lean init')
}
/**
 * 获取用户自定义配置
 */
async function getUserCustomSetting() {
  const BACKEND_CONFIG_OPTIONS = ['微信支付', '支付宝支付', '微信消息服务'];
  const FRONTEND_CONFIG_OPTIONS = ['微信支付', '支付宝支付'];
  const questions = [{
      type: 'input',
      message: 'Please enter your leancloud username',
      name: 'leancloudUsername'
    },
    {
      type: 'input',
      message: 'Please enter your leancloud password',
      name: 'leancloudPassword'
    }
  ];
  let answers = await inquirer.prompt(questions);
}
/**
 * 入口函数
 */
async function main(jdlpath) {
  // download leanengine
  await utils.downloadGitRep('discoverforever/node-js-getting-started', path.join(CWD, 'backend'));
  // download vux
  await utils.downloadGitRep('discoverforever/vux-template', path.join(CWD, 'frontend'));

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
  // generate vue router
  execSync('moon generate -r frontend/src/components', {
    stdio: [1, 2, 3]
  });

}

if (program.jdlpath) main(program.jdlpath);