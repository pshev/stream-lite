export const Subscriber = (nextOrSubscriber, error, complete) =>
  typeof nextOrSubscriber === 'object'
    ? nextOrSubscriber
    : {
      next: nextOrSubscriber,
      error: error || (() => {throw new Error()}),
      complete: complete || (() => {})
    }
