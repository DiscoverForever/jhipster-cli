
function getInput(prop, type) {
  let item = {
    tagName: 'XInput',
    modelName: prop.name,
    type: type,
    label: prop.name,
    defaultValue: '',
    max: 6,
    placeholder: prop.javadoc
  };
  prop.validations.forEach(validation => {
    if (validation.key === 'required') validation.value = true;
    item[validation.key] = validation.value;
  });
  return item;
}

function getActionsheet(prop, enu, index) {
  return {
    tagName: 'Actionsheet',
    defaultValue: 1,
    valueName: `currntMenu${index}`,
    cellTitle: prop.name,
    showCancle: true,
    cancelText: '关闭',
    menus: enu.values
  }
}

module.exports.generateUiMata = function (entity, enums) {
  let obj = { form: [] };
  let enumNames = enums.map(enu => enu.name);
  entity.body.forEach((prop, index) => {
    let item;
    if (prop.type === 'Service') return;
    if (prop.type === 'String') item = getInput(prop, 'text');
    if (prop.type === 'Integer' || prop.type === 'Long' || prop.type === 'BigDecimal' || prop.type === 'Float' || prop.type === 'Double' || prop.type === 'Float' || prop.type === 'Float') item = getInput(prop, 'number');
    if (enumNames.includes(prop.type)) {
      item = getActionsheet(prop, enums.find(enu => enu.name === prop.type), index);
    }
    obj.form.push(item);
  });


  return JSON.stringify(obj);
}

