import './create'
import {statics} from '../../core'

statics.fromEvent = function fromEvent(element, eventName) {
  const producer = {
    cb: null,
    start: function(consumer) {
      this.cb = consumer.next
      element.addEventListener(eventName, this.cb)
    },
    stop: function() {
      element.removeEventListener(eventName, this.cb)
    }
  }
  return statics.create(producer, 'fromEvent')
}
