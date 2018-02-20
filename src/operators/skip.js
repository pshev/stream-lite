import {baseCreate, baseNext} from '../internal'

export const skip = numberToSkip => stream => {
  let skipped = 0
  return baseCreate({
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
