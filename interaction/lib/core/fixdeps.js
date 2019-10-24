#!/usr/bin/env node
const fs = require('fs');
const packageJson = require('./dist/package.json');

delete packageJson['devDependencies'];
delete packageJson['dependencies'];
fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, undefined, 2));
