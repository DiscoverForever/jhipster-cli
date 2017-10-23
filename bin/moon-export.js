#!/usr/bin/env node
const program = require('commander');
const AV = require('leanengine');
const fs = require('fs');
const util = require('../lib/utils');
const path = require('path');

program
  .version('1.0.0')
  .usage('<entity-name>')
  .option('-e, --entityname <string>', 'a string argument')
  .option('-ep, --entitypath <string>', 'jdl file path or jdl dir path')
  .option('-t, --targetpath <string>', 'markdown file generate path')
  .parse(process.argv)


function initLeanCloud() {
  const options = require('../config/leancloud.config.json');
  AV.init(options);
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

  fs.appendFileSync(path.resolve(__dirname, `../export/${entityName}-export.g.md`), tableHeader);
  fs.appendFileSync(path.resolve(__dirname, `../export/${entityName}-export.g.md`), tableHeaderBottomLine);
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
    fs.appendFileSync(path.resolve(__dirname, `../export/${entityName}-export.g.md`), data);
  });

}


function run(entityName) {
  initLeanCloud();

  let jdl = util.readJDLFile(path.resolve(__dirname, `../dsl/${entityName}.jdl`));
  let entities = jdl.entities;
  let props = entities[0].body;
  const systemProps = [
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
  ];
  props.push(...systemProps);

  exportEntity(entityName, props);

}

if (program.entityname) run(program.entityname);