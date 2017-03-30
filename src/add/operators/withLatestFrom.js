import proto, {defaultOnNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.withLatestFrom = function withLatestFrom(s) {
  let sResult

  const stream = baseCreate({
    next: function(x) {
      if (sResult)
        defaultOnNext(this, [x, sResult])
    }
  }, this, 'withLatestFrom')

  s.subscribe(x => sResult = x, stream.error.bind(stream))

  return stream
}
