import {proto, baseNext, baseCreate} from '../../core'

proto.startWith = function startWith(...xs) {
  return baseCreate({
    streamActivated: function() {
      xs.forEach(x => baseNext(this, x))
    }
  }, this, 'startWith')
}
