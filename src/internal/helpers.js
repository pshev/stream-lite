export const isActive = s => s.active === true

export const isInactive = s => !isActive(s)

export const hasNoSubscribers = s => s.subscribers.length === 0

export const hasNoActiveDependencies = s => s.dependencies.every(isInactive)

export const hasNoActiveDependents = s => s.dependents.every(isInactive)

export const removeSubscriber = (s, subscriber) =>
  s.subscribers = s.subscribers.filter(sub => sub !== subscriber)

export const deactivationGuard = s => hasNoSubscribers(s) && hasNoActiveDependents(s)

export function activateStream(s) {
  s.active = true
  s.hasEmitted = false
}

export function startStream(s) {
  s.onStart()
  s.producer && s.producer.start(s)
}

export function deactivateStream(s) {
  s.active = false
  s.onStop()
  s.producer && s.producer.stop()
  s.subscribers = []
}
