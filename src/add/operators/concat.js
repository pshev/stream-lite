import {baseCreate, baseComplete, proto, statics} from '../../core'

const concat = (...streams) => {
  let subscription
  return baseCreate({
    complete: function() {
      if (streams.length === 0)
        baseComplete(this)
      else
        subscription = streams.shift().subscribe(
          this.next.bind(this),
          this.error.bind(this),
          this.complete.bind(this)
        )
    },
    start: function() {
      this.complete()
    },
    stop: function() {
      subscription && subscription.unsubscribe()
    }
  })
}

statics.concat = concat

proto.concat = function(...streams) {
  return concat(this, ...streams)
}
