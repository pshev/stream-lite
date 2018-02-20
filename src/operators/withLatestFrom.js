import {baseCreate, baseNext} from '../internal'

export const withLatestFrom = innerStream => stream => {
  let sResult
  let subscription

  return baseCreate({
    next(x) {
      baseNext(this, [x, sResult])
    },
    onStart() {
      subscription = innerStream.subscribe(
        x => sResult = x,
        this.error.bind(this)
      )
    },
    onStop() {
      subscription && subscription.unsubscribe()
      sResult = undefined
      subscription = undefined
    }
  }, stream)
}
