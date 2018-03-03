import {Stream} from '../internal'

export const takeUntil = innerStream => stream => {
  let subscription

  return Stream({
    onStart() {
      subscription = innerStream.subscribe(
        this.complete.bind(this),
        this.error.bind(this)
      )
    },
    onStop() {
      subscription && subscription.unsubscribe()
      subscription = undefined
    },
    dependencies: [stream]
  })
}
