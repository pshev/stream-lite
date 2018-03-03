import {baseNext, Stream, baseComplete} from '../internal'

export const bufferCount = (bufferSize, startBufferEvery) => stream => {
  if (!startBufferEvery || startBufferEvery === bufferSize)
    return noOverlap(stream, bufferSize)
  else
    return withOverlap(stream, bufferSize, startBufferEvery)
}

function noOverlap(stream, bufferSize) {
  let buffered = []

  return Stream({
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
  }, stream)
}

function withOverlap(stream, bufferSize, startBufferEvery) {
  let buffers = []
  let count = 0

  return Stream({
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
  }, stream)
}
