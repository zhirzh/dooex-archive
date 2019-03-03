const watch = require('fs').watch;
const execSync = require('child_process').execSync;

function build() {
  process.stdout.write('\x1b[1mBuilding AppShell:\x1b[0m ');

  try {
    const output = execSync('node dist/appshell.js', { stdio: 'pipe' }).toString();
    console.log('\x1b[1;32mSUCCESS\x1b[0m');
    console.log(output);
  } catch (e) {
    console.log('\x1b[1;31mFAILURE\x1b[0m');
    console.error(e.stack);
  }
}

if (process.argv.includes('-w') || process.argv.includes('--watch')) {
  const files = [
    'src/index.html', // appshell build dependency
    'dist/appshell.js', // appshell build dependency
    'dist/sw.js',
  ];
  files.forEach((file) => {
    console.log(`Watching: ${file}`);
    watch(file, build);
  });
  console.log();
}

setTimeout(build, 0);
