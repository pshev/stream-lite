import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.skip = function skip(numberToSkip) {
  let skipped = 0
  return baseCreate({
    next: function(x) {
      if (skipped === numberToSkip)
        defaultOnNext(this, x)
      else
        skipped++
    }
  }, this, 'skip')
}
