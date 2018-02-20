import {baseCreate, baseNext} from '../internal'

export const distinctUntilChanged = () => stream => {
  let lastValue
  return baseCreate({
    next(x) {
      if (x !== lastValue) {
        baseNext(this, x)
        lastValue = x
      }
    },
    onStop() {
      lastValue = undefined
    }
  }, stream)
}
