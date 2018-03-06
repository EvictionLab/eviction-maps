// Updates rankings metadata in index.html
const path = require('path');
const fs = require('fs');
const metadata = require('../src/environments/metadata');

let indexStr = fs.readFileSync(path.join(__dirname + '/../dist/index.html')).toString();

Object.keys(metadata.map).forEach(k => {
  const re = new RegExp(metadata.map[k], 'g');
  indexStr = indexStr.replace(re, metadata.rankings[k]);
});

fs.writeFileSync(path.join(__dirname, '../dist/index.html'), indexStr);
