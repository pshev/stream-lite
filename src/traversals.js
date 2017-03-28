const lastSubRemovedGuard = s =>
  s.subscribers.length === 0 && s.dependents.every(d => !d.shouldEmit)
const streamCompleteGuard = s => s.subscribers.length === 0

const traverseUp = ({forAll, forRoot, setShouldEmitTo}) => stream => {
  let queue = []
  let s = stream

  while (s) {

    if (s.shouldEmit === setShouldEmitTo) {
      s = queue.shift()
      continue
    }

    if (s.producer) {
      // it's a RootStream
      forAll(s)
      forRoot(s)
      s = queue.shift()
      continue
    }

    forAll(s)

    // it's a DependentStream
    s.dependencies
      .forEach(d => {
        if (d.shouldEmit === !setShouldEmitTo && queue.indexOf(d) === -1)
          queue.push(d)
      })

    s = queue.shift()
  }
}

export const traverseUpOnFirstSubscriberAdded = traverseUp({
  forRoot: s => s.producer.start(s),
  forAll:  s => {
    s.shouldEmit = true
    s.streamActivated()
  },
  setShouldEmitTo: true
})

export const traverseUpOnLastSubscriberRemoved = traverseUp({
  forRoot: s => lastSubRemovedGuard(s) && s.producer.stop(),
  forAll:  s => lastSubRemovedGuard(s) && (s.shouldEmit = false),
  setShouldEmitTo: false
})

export const traverseUpOnStreamCompleted = traverseUp({
  forRoot: s => streamCompleteGuard(s) && s.producer.stop(),
  forAll:  s => streamCompleteGuard(s) && (s.shouldEmit = false),
  setShouldEmitTo: false
})

export const traverseUpOnStreamError = traverseUp({
  forRoot: s => s.producer.stop(),
  forAll:  s => s.shouldEmit = false,
  setShouldEmitTo: false
})
