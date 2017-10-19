const AV = require('leanengine');
const fs = require('fs');
const util = require('./utils');
const path = require('path');

function initLeanCloud() {
  const APP_ID = '5dPGMHoFU57CCsl41B9qNBm2-gzGzoHsz';
  const APP_KEY = 'nDDE7yWX4NdencQFV7pQCOEX';
  const MASTER_KRY = 'ARAJmLqSbQ0CkREa6nFv1ObR';
  AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
    masterKey: MASTER_KRY
  });
  AV.Cloud.useMasterKey();
}

/**
 * 导出实体
 * @param entityName 
 */
async function exportEntity(entityName, props) {
  // 新建导出文件
  fs.writeFileSync(`${entityName}.md`, '');
  // 生成实体表Header
  await generateMdTableHeader(entityName, props);
  await generateMdTableContent(entityName, props);

}

/**
 * 生成markdown表头
 * @param entityName 实体名 
 * @param props 实体字段
 */
async function generateMdTableHeader(entityName, props) {
  let tableHeader = '';
  let tableHeaderBottomLine = '\n';
  props.forEach((prop, index) => {
    tableHeader += `${prop.javadoc.split('#')[0]}${props.length - 1 === index ? '' : '|'}`;
    tableHeaderBottomLine += `---------${props.length - 1 === index ? '' : '|'}`;
  });

  fs.appendFileSync(`${entityName}.md`, tableHeader);
  fs.appendFileSync(`${entityName}.md`, tableHeaderBottomLine);
}

/**
 * 生成markdown内容
 * @param entityName 
 * @param props 
 */
async function generateMdTableContent(entityName, props) {
  let entityQuery = new AV.Query(entityName);
  props.forEach(prop => {
    entityQuery.include(prop.name);
  });
  let items = await entityQuery.find();
  let data = '\n';
  items.forEach(item => {
    props.forEach((prop, index) => {
      try {
        if (item.get(prop.name) instanceof Object) {
          if (item.get(prop.name) instanceof Date)
            data += `${item.get(prop.name) ? item.get(prop.name).toLocaleString() : '无'}${index !== props.length - 1 ? '|' : ''}`;
          else
            data += `${item.get(prop.name) ? item.get(prop.name).get('name') : '无'}${index !== props.length - 1 ? '|' : ''}`;
        } else {
          data += `${item.get(prop.name) ? item.get(prop.name) : '无'}${index !== props.length - 1 ? '|' : ''}`;
        }
      } catch (error) {

      }

    });
    fs.appendFileSync(`${entityName}.md`, data);
  });

}


// module.exports.run = function (entityName) {
initLeanCloud();
// exportEntity(entityName);
// util.readJDLFile(path.resolve(__dirname, `../dsl/${entityName.toLowwerCase()}.jdl`));
let jdl = util.readJDLFile(path.resolve(__dirname, `../dsl/order.jdl`));
let entities = jdl.entities;
let props = entities[0].body;
props.push(...[
  {
    name: 'createdAt',
    type: 'Date',
    javadoc: '创建时间',
    validations: [],
  },
  {
    name: 'updatedAt',
    type: 'Date',
    javadoc: '更新时间',
    validations: [],

  }
]);
console.log(props)

exportEntity('Order', props);
// }
