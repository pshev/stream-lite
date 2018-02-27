import {create} from '../core'

export const fromPromise = (promise) => {
  const producer = {
    start(self) {
      if (!promise.then) {
        self.next(promise)
        self.complete()
        return
      }

      promise
        .then(x => {
            self.next(x)
            self.complete()
          },
          error => self.error(error))
    }
  }

  return create(producer)
}
