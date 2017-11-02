module.exports.generateUiMata = function (entity) {
  let obj = {form: []};
  entity.body.forEach(prop => {
    if (prop.type === 'Service') return;
    let item = {
      'tagName': 'XInput',
      'modelName': `${prop.name}`,
      'type': `${prop.type}`,
      'label': `${prop.name}`,
      'defaultValue': '',
      'max': 6,
      'placeholder': `${prop.javadoc}`,
      'required': true
    };
    obj.form.push(item);
  });
  return JSON.stringify(obj);
}