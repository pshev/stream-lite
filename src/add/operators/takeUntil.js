import proto from '../../core/proto'
import {baseCreate} from '../../core'

proto.takeUntil = function takeUntil(stream) {
  const s = baseCreate({}, this, 'takeUntil')

  stream.subscribe(
    s.complete.bind(s),
    this.error.bind(this)
  )

  return s
}
