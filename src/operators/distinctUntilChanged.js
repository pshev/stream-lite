import {Stream, baseNext} from '../internal'

export const distinctUntilChanged = () => stream => {
  let lastValue
  return Stream({
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
