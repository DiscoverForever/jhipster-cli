
function getStr(configs) {
  let data = '';
  configs.forEach(config => {
    if (config.tagName === 'input') data += `<x-input title="${config.label}" type="${config.type}" v-model="${config.name}" placeholder="${config.placeholder}" ${config.min ? `:min="${config.min}"` : ''} ${config.max ? `:max="${config.max}"` : ''} :required="${config.required}"></x-input>\n`
    if (config.tagName === 'button') data += `<x-button type="${config.type}" action-type="${config.actionType}">${config.text}</x-button>`;
  });
  return data;
}


function getDataOptions(configs) {
  let data = '';
  configs.forEach(config => {
    if (config.tagName === 'input') data += `${config.name}:${config.defaultValue ? config.defaultValue : "''"},\n`
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
    <group title="">
      ${getStr(formConfig)}
    </group>
  </div>
  </template>
  <script>
  import { XInput, Group, XButton, Cell } from 'vux';
  export default {
    components: {
      XInput, Group, XButton, Cell
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