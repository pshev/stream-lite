import {baseCreate} from '../internal'

export const takeUntil = innerStream => stream => {
  let subscription

  return baseCreate({
    onStart() {
      subscription = innerStream.subscribe(
        this.complete.bind(this),
        this.error.bind(this)
      )
    },
    onStop() {
      subscription && subscription.unsubscribe()
      subscription = undefined
    }
  }, stream)
}
