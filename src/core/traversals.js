const streamCompleteGuard = s => s.subscribers.length === 0
const lastSubRemovedGuard = s => s.subscribers.length === 0 && s.dependents.every(d => !d.active)

export const traverseUpOnFirstSubscriberAdded = traverseUp({
  setActiveTo: true
})

export const traverseUpOnLastSubscriberRemoved = traverseUp({
  guard: lastSubRemovedGuard,
  setActiveTo: false
})

export const traverseUpOnStreamCompleted = traverseUp({
  guard: streamCompleteGuard,
  setActiveTo: false
})

export const traverseUpOnStreamError = traverseUp({
  setActiveTo: false
})

function traverseUp({guard, setActiveTo}) {
  guard = guard || (() => true)
  return function(stream) {
    let s = stream
    let queue = []
    let rootStreamsToStart = []

    const forAll = s => {
      s.active = setActiveTo
      s.active ? s.streamActivated() : s.streamDeactivated()
    }
    const forRoot = s => setActiveTo === true
      ? rootStreamsToStart.push(s)
      : s.producer.stop()
    // In 'forRoot' why not call s.producer.start right inline?
    // if we have something like this:
    // Stream.merge(Stream.of(1), Stream.of(2)).subscribe(..)
    // we want to first mark both 'of' streams as active
    // and only then let them start producing values
    // If we can producer.start inline we'd have:
    // of(1) calls next on merge with 1
    // of(1) completes and conditionally calls .complete() on all it's dependents
    // the condition being d.dependencies.every(dep => !dep.active)
    // of(2) however hasn't yet had it's active flag set to true so condition passes
    // as a result merge stream completes and doesn't emit 2

    while (s) {
      if (s.producer) {
        // it's a RootStream
        guard(s) && forAll(s)
        guard(s) && forRoot(s)
        s = queue.shift()
        continue
      }

      // it's a DependentStream
      guard(s) && forAll(s)
      s.dependencies.forEach(d => {
        if (d.active === !setActiveTo && queue.indexOf(d) === -1)
          queue.push(d)
      })

      s = queue.shift()
    }

    rootStreamsToStart.forEach(s => s.producer.start(s))
  }
}
