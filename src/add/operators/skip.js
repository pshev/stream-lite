import proto, {baseNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.skip = function skip(numberToSkip) {
  let skipped = 0
  return baseCreate({
    next: function(x) {
      if (skipped === numberToSkip)
        baseNext(this, x)
      else
        skipped++
    }
  }, this, 'skip')
}
