import {Stream, baseNext} from '../internal'

export const pairwise = () => stream => {
  let prev
  let hasPrev = false

  return Stream({
    next(x) {
      if (hasPrev)
        baseNext(this, [prev, x])
      else
        hasPrev = true

      prev = x
    },
    onStop() {
      prev = null
      hasPrev = false
    },
    dependencies: [stream]
  })
}