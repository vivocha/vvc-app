#!/usr/bin/env node

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2);

const flags = {
  activate: false,
  global: false
};

const updateFlags = args => {
  flags.activate = args.indexOf('-a') !== -1;
  flags.global = args.indexOf('-g') !== -1;
};

const displayHelp = () => {
  console.log(usage);
};

const pushWidgets = async widgets => {
  if (Array.isArray(widgets) && widgets.length) {
    const p = widgets.map(async widgetFolder => {
      if (fs.existsSync(`./${widgetFolder}`)) {
        const push = `vvc widget push ${flags.activate ? '-a' : ''} ${flags.global ? '-g' : ''}`;
        console.log(push);
        const res = await exec(`cd ./${widgetFolder} && ${push} && cd ..`);
        console.log(`${widgetFolder} push done`, res.stdout);
        if (res.stderr) {
          console.error(res.stderr);
        }
      } else {
        console.log(`${widgetFolder} not found`);
      }
    });
    await Promise.all(p);
  }
};

const pushAllWidgets = () => {
  const dir = fs.readdirSync('./');
  const widgets = [];
  dir.map(item => {
    if (fs.lstatSync(`./${item}`).isDirectory()) {
      widgets.push(item);
    }
  });
  pushWidgets(widgets);
};

const usage = `
  Push one or more Vivocha Engagement Widget(s)

  Example Usage: node push-widgets amazon-cbn halo sidetab

  The script takes the folder name of the widget(s) as argument.

  Options:

  -h                display this help
  -all              push all widgets

  -a                activate widgets (vvc widget push -a)
  -g                push global      (vvc widget push -g)
`;

if (args.length) {
  updateFlags(args);

  switch (args[0]) {
    case '-h': {
      displayHelp();
      break;
    }
    case '-all': {
      pushAllWidgets();
      break;
    }
    default: {
      pushWidgets(args);
      break;
    }
  }
} else {
  displayHelp();
}
