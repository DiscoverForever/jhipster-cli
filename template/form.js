
function getStr(configs) {
  let data = '';
  configs.forEach(config => {
    if (config.tagName === 'input') data += `${config.withGroup === false ? '' : '<group>'}
      <x-input title="${config.label}" type="${config.type}" v-model="${config.model}" placeholder="${config.placeholder}" ${config.min ? `:min="${config.min}"` : ''} ${config.max ? `:max="${config.max}"` : ''} :required="${config.required}"></x-input>
    ${config.withGroup === false ? '' : '</group>'}\n`
    if (config.tagName === 'button') data += `${config.withGroup === false ? '' : '<group>'}
      <x-button type="${config.type}" action-type="${config.actionType}">${config.text}</x-button>
    ${config.withGroup === false ? '' : '</group>'}\n`;
    if (config.tagName === 'address') data += `${config.withGroup === false ? '' : '<group>'}
      <x-address title="${config.title}" v-model="${config.model}" :list="ChinaAddressV4Data"></x-address>
    ${config.withGroup === false ? '' : '</group>'}\n`
    if (config.tagName === 'datetime') data += `${config.withGroup === false ? '' : '<group>'}
    <datetime v-model="${config.model}"  title="${config.title}"></datetime>
    ${config.withGroup === false ? '' : '</group>'}\n`
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
    if (config.tagName === 'button') set.add('XButton');
    if (config.tagName === 'input') {
      set.add('Group');
      set.add('XInput');
    }
    if (config.tagName === 'address') {
      if (!justComponent) set.add('ChinaAddressV4Data');
      set.add('Group');
      set.add('XAddress');
    }
  });
  let arr = Array.from(set);
  let data = '';
  arr.forEach(item => {
    data += `${item},`;
  });
  return data;
}

function getDataOptions(configs) {
  let data = '';
  configs.forEach(config => {
    if (config.tagName === 'input') data += `${config.model}:${config.defaultValue ? config.defaultValue : "''"},\n`;
    if (config.tagName === 'datetime') data += `${config.model}:${config.defaultValue ? config.defaultValue : "''"},\n`;
    if (config.tagName === 'address') data += `${config.model}:${config.defaultValue ? config.defaultValue : "''"},
    ChinaAddressV4Data:ChinaAddressV4Data,`;
  });
  return data;
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