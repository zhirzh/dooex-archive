async function importComponent(url, _, cb) {
  try {
    const module = await import(`./${url}/index.js`);
    const component = module.default;

    cb(null, component);
  } catch (e) {
    console.error(e);
  }
}

export default importComponent;
