export const ERROR = {}

export function _try(stream, fn) {
  try {
    return fn()
  } catch (err) {
    stream.error(err)
    return ERROR
  }
}
