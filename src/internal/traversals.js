let temporaryQueue = []

const queueDependencies = (stream, predicate) => {
  const shouldQueue = d => predicate(d) && temporaryQueue.indexOf(d) === -1

  stream.dependencies
    .filter(shouldQueue)
    .forEach(d => temporaryQueue.push(d))
}

export const traverseUp = (stream, {predicate, action, actionGuard}) => {
  let s = stream
  predicate = predicate || (() => true)
  actionGuard = actionGuard || (() => true)

  queueDependencies(s, predicate)
  s = temporaryQueue.shift()

  while (s) {
    if (actionGuard(s)) {
      action(s)
      queueDependencies(s, predicate)
    }
    s = temporaryQueue.shift()
  }
}
