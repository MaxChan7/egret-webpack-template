const fs = require('fs');
const setting = JSON.parse(fs.readFileSync('./build/setting.json'));
const libs = setting.libs;

function removeWeb(name) {
  return name.replace(/\.web/, '');
}

const devMergeLibs = libs.map(name => `./src/libs/${removeWeb(name)}/${name}.js`);
const prodMergeLibs = libs.map(name => `./src/libs/${removeWeb(name)}/${name}.min.js`);

const copyLibs = libs.map(name => `libs/${name}.js`);
const devCopyLibs = libs.map(name => {
  return {from:`src/libs/${removeWeb(name)}/${name}.js`, to:`libs/${name}.js`};
});
const prodCopyLibs = libs.map(name => {
  return {from:`src/libs/${removeWeb(name)}/${name}.min.js`, to:`libs/${name}.js`};
});

module.exports = {
  devMergeLibs,
  prodMergeLibs,
  copyLibs,
  devCopyLibs,
  prodCopyLibs,
}