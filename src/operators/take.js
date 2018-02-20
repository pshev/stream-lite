import {baseCreate, baseNext} from '../internal'

export const take = numberToTake => stream => {
  let taken = 0

  return baseCreate({
    next(x) {
      if (taken < numberToTake) {
        baseNext(this, x)

        taken++

        if (taken === numberToTake) {
          this.complete()
        }
      }
    },
    onStop() {
      taken = 0
    }
  }, stream)
}
