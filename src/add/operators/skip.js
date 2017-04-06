import {baseCreate, baseNext, proto} from '../../core'

proto.skip = function skip(numberToSkip) {
  let skipped = 0
  return baseCreate({
    next: function(x) {
      if (skipped === numberToSkip)
        baseNext(this, x)
      else
        skipped++
    },
    stop: function() {
      skipped = 0
    }
  }, this, 'skip')
}
