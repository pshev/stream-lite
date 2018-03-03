import {Stream, baseNext} from '../internal'

export const skip = numberToSkip => stream => {
  let skipped = 0
  return Stream({
    next(x) {
      if (skipped === numberToSkip)
        baseNext(this, x)
      else
        skipped++
    },
    onStop() {
      skipped = 0
    }
  }, stream)
}
