const fs = require('fs');
const path = require('path');

const babel = require('babel-core');
const packageJson = require('../package.json');

process.env.NODE_ENV = 'production';
process.env.SERVER = true;

/**
 * @param {string} filePath
 */
function mkdir(filePath) {
  const dirname = filePath.endsWith('/') ? filePath : path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }

  mkdir(dirname);

  fs.mkdirSync(dirname);
}

/**
 * @param {string} dir
 * @returns {Array<string>}
 */
function walk(dir) {
  let results = [];

  fs.readdirSync(dir).forEach((filename) => {
    const filepath = path.join(dir, filename);

    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      results = results.concat(walk(filepath));
    } else {
      results.push(filepath);
    }
  });

  return results;
}

const babelrc = Object.assign(packageJson.babel, {
  plugins: [
    [
      'module-resolver',
      {
        root: ['src'],
      },
    ],

    [
      'css-modules-transform',
      {
        generateScopedName: '[hash:base64]',
        extensions: ['.css', '.scss'],
      },
    ],
  ],
});

const BASE_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(BASE_DIR, 'src');
const LIB_DIR = path.join(BASE_DIR, 'lib');

walk(SRC_DIR)
  .filter(filepath => filepath.match(/\.jsx?/))
  .map((filepath) => {
    const libpath = filepath.replace(SRC_DIR, LIB_DIR).replace('.jsx', '.js');

    mkdir(libpath);

    // first transform converts es6 code to cjs
    const transform1 = babel.transformFileSync(filepath, babelrc);
    fs.writeFileSync(libpath, transform1.code);

    // second transform converts `import/export` to `require`
    const transform2 = babel.transformFileSync(libpath, {
      plugins: ['transform-es2015-modules-commonjs']
    });
    fs.writeFileSync(libpath, transform2.code);

    const from = filepath.replace(`${BASE_DIR}/`, '');
    const to = libpath.replace(`${BASE_DIR}/`, '');
    console.log(from, '->', to);
  });
