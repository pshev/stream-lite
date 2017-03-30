import {statics} from '../../core'

statics.interval = function interval(step) {
  const producer = {
    counter: 0,
    id: 0,
    start: function(consumer) {
      this.id = setInterval(() => consumer.next(this.counter++), step)
    },
    stop: function() {
      clearInterval(this.id)
    }
  }
  return statics.create(producer, 'interval_' + step)
}
