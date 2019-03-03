const fs = require('fs');
const path = require('path');

const cp = require('child_process');

const base = path.resolve(__dirname);

fs.readdirSync(base)
  .map(modName => path.resolve(base, modName))
  .filter(modPath => fs.statSync(modPath).isDirectory())
  .forEach((modPath) => {
    const packageJsonPath = path.resolve(modPath, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
      return;
    }

    cp.spawn('npm', ['i'], { env: process.env, cwd: modPath, stdio: 'inherit' });
  });
