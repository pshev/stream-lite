export function traverseUp(s, {predicate, action, actionGuard}) {
  let q = []
  const queue = () => s.dependencies
    .filter(d => predicate(d) && q.indexOf(d) === -1)
    .forEach(d => q.push(d))

  queue()
  s = q.shift()

  while (s) {
    if (actionGuard === undefined || actionGuard(s)) {
      action(s)
      queue()
    }
    s = q.shift()
  }
}
