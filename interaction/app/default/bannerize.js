#!/usr/bin/env node

const fs = require('fs');
const packageJson = require('./package.json');
// const args = process.argv.slice(2);

try {
  const packages = {
    app: require('./package.json'),
    core: require('@vivocha/client-interaction-core/package.json'),
    layout: require('@vivocha/client-interaction-layout/package.json')
  }
  const today = (new Date()).toString();
  const buildinfo = 
`<!--
--------------------------------------------------
  Vivocha Interaction App ${packages.app.version}
  interaction-core: ${packages.core.version}
  interaction-layout: ${packages.layout.version}
  built: ${today}
--------------------------------------------------
-->
`;
  const mainHtmlPath = './dist/main.html';
  const mainHtml = fs.readFileSync(mainHtmlPath, "utf-8");
  const updatedMainHtml = mainHtml + buildinfo;
  fs.writeFileSync(mainHtmlPath, updatedMainHtml);
  console.log('bannerize: updated main.html');

  delete packageJson['scripts'];
  delete packageJson['devDependencies'];
  delete packageJson['dependencies'];
  fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, undefined, 2));
  console.log('bannerize: updated package.json');
} catch (e) {
  console.warn('bannerize: main.html not updated', e);
}
