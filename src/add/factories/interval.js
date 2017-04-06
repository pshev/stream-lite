import {statics} from '../../core'

statics.interval = function interval(step) {
  const producer = {
    counter: 0,
    id: 0,
    start(consumer) {
      this.id = setInterval(() => consumer.next(this.counter++), step)
    },
    stop() {
      clearInterval(this.id)
      this.id = 0
      this.counter = 0
    }
  }
  return statics.create(producer, 'interval_' + step)
}
