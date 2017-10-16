function getProps(props) {
  let str = '';
  props.forEach(prop => {
    str += `${prop.name}:${prop.type};\n`;
  });
  return str;
}
module.exports.generateEntity = entity => {
  return `
  class ${entity.name} {
    ${getProps(entity.body)}
  }
  `
}