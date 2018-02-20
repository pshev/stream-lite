import {create} from '../core'

export const timer = (initialDelay, step) => {
  const producer = {
    counter: 1,
    id: null,
    start(consumer) {
      setTimeout(() => {
        consumer.next(0)
        if (step)
          this.id = setInterval(() => consumer.next(this.counter++), step)
        else
          consumer.complete()
      }, initialDelay)
    },
    stop() {
      clearInterval(this.id)
      this.id = 0
      this.counter = 0
    }
  }

  return create(producer)
}
