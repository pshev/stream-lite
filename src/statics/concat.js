import {Stream, baseComplete} from '../internal'

export const concat = (...streams) => {
  let subscription

  return Stream({
    complete() {
      if (streams.length === 0)
        baseComplete(this)
      else
        subscription = streams.shift().subscribe(
          this.next.bind(this),
          this.error.bind(this),
          this.complete.bind(this)
        )
    },
    onStart() {
      this.complete()
    },
    onStop() {
      subscription && subscription.unsubscribe()
    }
  })
}
