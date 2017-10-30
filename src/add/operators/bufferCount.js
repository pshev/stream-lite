import {proto, baseNext, baseCreate, baseComplete} from '../../core'

proto.bufferCount = function bufferCount(bufferSize, startBufferEvery) {
  if (!startBufferEvery || startBufferEvery === bufferSize)
    return noOverlap.call(this, bufferSize)
  else
    return withOverlap.call(this, bufferSize, startBufferEvery)
}

function noOverlap(bufferSize) {
  let buffered = []

  return baseCreate({
    next(x) {
      buffered.push(x)
      if (buffered.length === bufferSize) {
        baseNext(this, buffered)
        buffered = []
      }
    },
    complete() {
      if (buffered.length)
        baseNext(this, buffered)

      baseComplete(this)
    },
    onStop() {
      buffered = []
    }
  }, this, 'bufferCount')
}

function withOverlap(bufferSize, startBufferEvery) {
  let buffers = []
  let count = 0

  return baseCreate({
    next(x) {
      if (count % startBufferEvery === 0)
        buffers.push([])

      for (let i = buffers.length; i--;) {
        let buffer = buffers[i]
        buffer.push(x)
        if (buffer.length === bufferSize) {
          buffers.splice(i, 1)
          baseNext(this, buffer)
        }
      }

      count++
    },
    complete() {
      while (buffers.length) {
        let buffer = buffers.shift()
        if (buffer.length)
          baseNext(this, buffer)
      }
      baseComplete(this)
    },
    onStop() {
      buffers = []
      count = 0
    }
  }, this, 'bufferCount')
}
