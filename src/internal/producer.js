export function Producer(producer = {}) {
  producer.start = producer.start || (() => {})
  producer.stop = producer.stop || (() => {})
  return producer
}