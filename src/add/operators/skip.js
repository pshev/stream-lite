import {baseCreate, baseNext, proto} from '../../core'

proto.skip = function skip(numberToSkip) {
  let skipped = 0
  return baseCreate({
    next(x) {
      if (skipped === numberToSkip)
        baseNext(this, x)
      else
        skipped++
    },
    stop() {
      skipped = 0
    }
  }, this, 'skip')
}
