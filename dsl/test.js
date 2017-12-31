const fs = require("fs");
const str = fs.readFileSync('example.jdl').toString();
const reg = /^enum\b.*\{([\s\S]*)\}\n/gm
const res = reg.exec(str)[1]
const reg1 = /\/\*{2}(.*)\*\//gm //enum values
console.log(res.match(reg1).map(item => item.replace(/\/\*{2}(.*)\*\//g, '$1')))
const javadocs = res.match(reg1).map(item => item.replace(/\/\*{2}(.*)\*\//g, '$1'))
const values = res.replace(/\/\*{2}(.*)\*\//g, '').replace(/\n/g, '').replace(/\s+/g, '').split(',')
console.log(values)
const reg_enum_name = /enum(\s)*(.*)(\s)*\{/g
const enumName = reg_enum_name.exec(str)[2]
console.log(enumName)

var enumObj = {};
enumObj.name = enumName;
enumObj.type = 'enum';
enumObj.body = values.map((value,index) => {return {name: enumName, prop: {name: values[index], javadoc: javadocs[index]}}})
// console.log(JSON.stringify(enumObj))

// console.log(str.replace(/->/g, '__').replace(/(enum.*\{)([\s\S]*)(\/\*{2}.*\*\/)([\s\S]*)(\})/g, '$1$4$5'))
console.log(str.match(/(^enum\b.*\{\n)([\s\S]*)(\}\n)/gm)[0])
console.log(str.match(/(^enum\b.*\{\n)([\s\S]*)(\}\n)/gm)[0].replace(/\/\*{2}.*\*\/\n/gm, ''))