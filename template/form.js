
function getStr(configs) {
  let data = '';
  configs.forEach((config, index) => {
    // add group wrapper
    if (config.withGroup === undefined || config.withGroup) data += `<group title="${config.title ? config.title : ''}" label-width="${config.labelWith ? config.labelWith : '5.5em'}" label-margin-right="${config.labelmarginRight ? config.labelmarginRight : '2em'}" label-align="${config.labelAlign ? config.labelAlign : 'justify'}">`;

    if (config.tagName === 'XInput')
      data += `<x-input title="${config.label}" type="${config.type}" v-model="${config.model}" placeholder="${config.placeholder}" ${config.min ? `:min="${config.min}"` : ''} ${config.max ? `:max="${config.max}"` : ''} :required="${config.required}"></x-input>`;
    if (config.tagName === 'XButton')
      data += `<x-button type="${config.type}" action-type="${config.actionType}">${config.text}</x-button>`;
    if (config.tagName === 'XAddress')
      data += `<x-address title="${config.title}" v-model="${config.model}" :list="Private_ChinaAddressV4Data"></x-address>`;
    if (config.tagName === 'Datetime')
      data += `<datetime v-model="${config.model}"  title="${config.title}"></datetime>`;
    if (config.tagName === 'Actionsheet')
      data += `<cell title="${config.cellTitle ? config.cellTitle : '选择'}" @click.native="Private_isShowActionsheet${index} = !Private_isShowActionsheet${index}">{{currentMenu${index}}}</cell>
    <actionsheet v-model="Private_isShowActionsheet${index}" :menus="${JSON.stringify(config.menus)}" :show-cancel="true" @on-click-menu="(key, item) => currentMenu${index} = item"></actionsheet>`;
    if (config.tagName === 'XHeader') data += `<x-header>${config.title}</x-header>`
    // add group wrapper
    if (config.withGroup === undefined || config.withGroup) data += '</group>';
  });
  return data;
}

/**
 * 获取依赖组件
 * @param configs 
 * @param justComponent 只取依赖组件 
 */
function getDependencies(configs, justComponent = false) {
  let set = new Set();
  configs.forEach(config => {
    set.add(config.tagName);
    if (config.tagName === 'XInput' || config.tagName === 'XAddress') set.add('Group');
    if (config.tagName === 'XAddress' && !justComponent) set.add('ChinaAddressV4Data');
    if (config.tagName === 'Actionsheet') set.add('Cell');
  });
  // 去重
  let arr = Array.from(set);
  let data = '';
  arr.forEach((item, index) => {
    data += `${item}${index === arr.length - 1 ? '' : ','}`;
  });
  return data;
}

function getDataOptions(configs) {
  let data = '';
  configs.forEach((config, index) => {
    if (config.tagName === 'XInput') data += `${config.model}:${config.defaultValue ? JSON.stringify(config.defaultValue).replace(/"/g, "'") : "''"},`;
    if (config.tagName === 'Datetime') data += `${config.model}:${config.defaultValue ? JSON.stringify(config.defaultValue).replace(/"/g, "'") : "''"},`;
    if (config.tagName === 'XAddress') data += `${config.model}:${config.defaultValue ? JSON.stringify(config.defaultValue).replace(/"/g, "'") : "''"},Private_ChinaAddressV4Data:ChinaAddressV4Data,`;
    if (config.tagName === 'Actionsheet') data += `currentMenu${index}:'',Private_isShowActionsheet${index}: false`;
  });
  return data;
}

function getMethods(configs) {

}
/**
 * 生成表单
 * 
 * @param formConfig 
 */
function generateForm(formConfig) {
  return `
  <template>
  <div>
    ${getStr(formConfig, false)}
  </div>
  </template>
  <script>
  import { ${getDependencies(formConfig)} } from 'vux';
  export default {
    components: {
      ${getDependencies(formConfig, true)}
    },
    data() {
      return {
        ${getDataOptions(formConfig)}
      }
    },
    methods: {}
  };
  </script>
  <style scoped>
  </style>
  `;
}

module.exports.generateForm = generateForm;