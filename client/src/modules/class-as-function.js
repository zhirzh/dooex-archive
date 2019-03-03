// @flow

/**
 * Allow calling class constructor without `new`
 * @param {class} C
 */
function classAsFunction(C) {
  const wrapped = (...args: Array<*>) => new C(...args);

  Object.defineProperty(wrapped, 'name', {
    value: C.name,
  });

  return wrapped;
}

export default classAsFunction;
