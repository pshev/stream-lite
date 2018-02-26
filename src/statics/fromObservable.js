import {create} from '../core'

export const fromObservable = (observable) => {
  const producer = {
    subscription: null,
    start(self) {
      this.subscription = observable.subscribe({
        next: self.next.bind(self),
        error: self.error.bind(self),
        complete: self.complete.bind(self),
      })
    },
    stop() {
      this.subscription && this.subscription.unsubscribe()
      this.subscription = null
    }
  }

  return create(producer)
}
