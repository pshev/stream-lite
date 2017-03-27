const deactivationGuard = s =>
  s.subscribers.length === 0 && s.dependents.every(d => !d.shouldEmit)

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

export const traverseUpOnStreamActivation = traverseUp({
  forRoot: s => s.producer.start(s),
  forAll:  s => {
    s.shouldEmit = true
    s.streamActivated()
  },
  setShouldEmitTo: true
})

export const traverseUpOnStreamDeactivation = traverseUp({
  forRoot: s => deactivationGuard(s) && s.producer.stop(),
  forAll:  s => deactivationGuard(s) && (s.shouldEmit = false),
  setShouldEmitTo: false
})

export const traverseUpOnStreamError = traverseUp({
  forRoot: s => s.producer.stop(),
  forAll:  s => s.shouldEmit = false,
  setShouldEmitTo: false
})
