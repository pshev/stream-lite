export const Subscriber = (nextOrSubscriber, error, complete) => {
  if (typeof nextOrSubscriber === 'object') {
    nextOrSubscriber.error = nextOrSubscriber.error  || (err => {throw err})
    nextOrSubscriber.complete = nextOrSubscriber.complete  || (() => {})
    return nextOrSubscriber
  }

  return {
    next: nextOrSubscriber,
    error: error || (err => {throw err}),
    complete: complete || (() => {})
  }
}
