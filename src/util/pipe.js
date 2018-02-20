export const pipe = (...fns) =>
  fns.length === 1
    ? fns[0]
    : fns.reduce((f, g) => (...args) => g(f(...args)))
