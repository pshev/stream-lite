import chai from 'chai'
import spies from 'chai-spies'
import './add/all'
import Stream from './'

chai.use(spies)

const expect = chai.expect

const isStream = x => x.subscribe && x.next && x.error && x.complete
const isRootStream = x => isStream(x) && x.dependencies.length === 0

const nx = () => {}
const err = () => {}

describe('factories', () => {
  describe('create', () => {
    it('should create a root stream when given no arguments', () => {
      expect(Stream.create()).to.satisfy(isRootStream)
    })
    it('should create a root stream when given a producer', () => {
      const producer = {
        start: () => {},
        stop: () => {},
      }
      expect(Stream.create(producer)).to.satisfy(isRootStream)
    })
    it('should not start a stream before anyone subscribes', () => {
      const start = chai.spy()
      const producer = {
        start,
        stop: () => {},
      }

      const s = Stream.create(producer)

      expect(producer.start).to.not.have.been.called()
    })
    it('should start a stream when first subscriber is added', () => {
      const start = chai.spy()
      const producer = {
        start,
        stop: () => {},
      }

      const s = Stream.create(producer)

      s.subscribe(() => {})

      expect(producer.start).to.have.been.called.once()
    })
  })

  describe('of', () => {
    it("should emit a given value", (done) => {
      Stream.of(42).subscribe(x => {
        expect(x).to.equal(42)
        done()
      })
    })
    it("should complete after emitting the given value", (done) => {
      Stream.of(42).subscribe(() => {}, err, done)
    })
    it("should emit all given values in a sequence", (done) => {
      const next = chai.spy()
      Stream.of(1,2).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
    it("should handle emitting objects, array, and functions", (done) => {
      const next = chai.spy()

      const obj = {name: 'Joe'}
      const arr = [1,2,3]
      const func = () => 'hello'

      Stream.of(obj, arr, func).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(obj)
        expect(next).to.have.been.called.with(arr)
        expect(next).to.have.been.called.with(func)
        done()
      })
    })
  })

  describe('fromArray', () => {
    it("should complete after emitting the given value", (done) => {
      Stream.fromArray([1,2]).subscribe(() => {}, err, done)
    })
    it("should emit all given values in a sequence", () => {
      const next = chai.spy()
      Stream.fromArray([1,2]).subscribe(next, err, (done) => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.twice()
      })
    })
    it("should emit all given values in a sequence", (done) => {
      const next = chai.spy()
      Stream.fromArray([1,2]).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
    it("should handle emitting objects, array, and functions", (done) => {
      const next = chai.spy()

      const obj = {name: 'Joe'}
      const arr = [1,2,3]
      const func = () => 'hello'

      Stream.fromArray([obj, arr, func]).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(obj)
        expect(next).to.have.been.called.with(arr)
        expect(next).to.have.been.called.with(func)
        done()
      })
    })
  })

  describe('fromEvent', () => {
    it("should listen to given element's event's by event name and emit them", () => {
      const next = chai.spy()
      //fake element that immediately produces events when a listener is added
      const fakeElement = {
        addEventListener: function(eventName, cb) {
          cb(1)
          cb(2)
        },
        removeEventListener: () => {}
      }

      Stream.fromEvent(fakeElement, 'fakeEventName').subscribe(next)

      expect(next).to.have.been.called.with(1)
      expect(next).to.have.been.called.with(2)
      expect(next).to.have.been.called.twice()
    })
    it("should stop listening to given element's events by event name on complete", (done) => {
      const next = chai.spy()
      const removeEventListener = chai.spy()
      //fake element that immediately produces events when a listener is added
      const fakeElement = {
        addEventListener: function(eventName, cb) {
          cb(1)
          cb(2)
        },
        removeEventListener
      }

      Stream.fromEvent(fakeElement, 'fakeEventName').take(1).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.not.have.been.called.with(2)
        expect(next).to.have.been.called.once()
        expect(removeEventListener).to.have.been.called.once()
        done()
      })
    })
    it("should stop listening to given element's events by event name on error", (done) => {
      const next = chai.spy()
      const removeEventListener = chai.spy()
      //fake element that immediately produces events when a listener is added
      const fakeElement = {
        addEventListener: function(eventName, cb) {
          cb(1)
          cb(2)
        },
        removeEventListener
      }

      Stream.fromEvent(fakeElement, 'fakeEventName')
        .map(x => {throw new Error('mapError')})
        .subscribe(next, error => {
          expect(error.message).to.equal('mapError')
          expect(next).to.not.have.been.called()
          expect(removeEventListener).to.have.been.called.once()
          done()
        })
    })
  })

  describe('empty', () => {
    it("should immediately complete", (done) => {
      Stream.empty().subscribe(nx, err, done)
    })
    it("should not call subscriber's next callback", (done) => {
      const next = chai.spy()
      Stream.empty().subscribe(next, err, () => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
  })

  describe('throw', () => {
    it("should immediately error", (done) => {
      Stream.throw().subscribe(nx, done)
    })
    it("should not call subscriber's next callback", (done) => {
      const next = chai.spy()
      Stream.throw().subscribe(next, () => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
    it("should not complete", (done) => {
      const complete = chai.spy()
      Stream.throw().subscribe(nx, err, complete)

      setTimeout(() => {
        expect(complete).to.not.have.been.called()
        done()
      })
    })
  })

  describe('never', () => {
    it("should not next", (done) => {
      const next = chai.spy()
      Stream.never().subscribe(next)

      setTimeout(() => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
    it("should not error", (done) => {
      const error = chai.spy()
      Stream.never().subscribe(nx, error)

      setTimeout(() => {
        expect(error).to.not.have.been.called()
        done()
      })
    })
    it("should not complete", (done) => {
      const complete = chai.spy()
      Stream.never().subscribe(nx, err, complete)

      setTimeout(() => {
        expect(complete).to.not.have.been.called()
        done()
      })
    })
  })

  describe('fromPromise', () => {
    it("should call subscriber's next callback when promise is fulfilled", (done) => {
      Stream.fromPromise(Promise.resolve(42)).subscribe(() => done())
    })
    it("should complete when promise is fulfilled", (done) => {
      Stream.fromPromise(Promise.resolve(42)).subscribe(nx, err, done)
    })
    it("should call subscriber's error callback when promise is rejected", (done) => {
      Stream.fromPromise(Promise.reject(42)).subscribe(nx, error => done())
    })
    it("should work with the 'catch' operator", (done) => {
      const next = chai.spy()
      const error = chai.spy()
      Stream.fromPromise(Promise.reject(42))
        .catch(error => Stream.of('caught promise error'))
        .subscribe(next, error, () => {
          expect(next).to.have.been.called.with('caught promise error')
          expect(error).to.not.have.been.called()
          done()
        })
    })
  })
})

describe('operators', () => {
  describe('map', () => {
    it("should complete when source stream completes", (done) => {
      Stream.of(1,2,3).map(() => 42).subscribe(nx, err, done)
    })
    it("should error when source stream errors", (done) => {
      Stream.throw().map(() => 42).subscribe(nx, done)
    })
    it("should not run the mapping function when source stream errors", (done) => {
      const mappingFn = chai.spy()
      Stream.throw().map(mappingFn).subscribe(nx, err => {
        expect(mappingFn).to.not.have.been.called()
        done()
      })
    })
    it("should run values emitted from source stream through the given mapping function", (done) => {
      const mappingFn = chai.spy()
      Stream.of(1,2).map(mappingFn).subscribe(nx, err, () => {
        expect(mappingFn).to.have.been.called.with(1)
        expect(mappingFn).to.have.been.called.with(2)
        expect(mappingFn).to.have.been.called.twice()
        done()
      })
    })
    it("should emit values coming out of it's transformation function", (done) => {
      const next = chai.spy()
      Stream.of(1,2).map(x => x * 3).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(3)
        expect(next).to.have.been.called.with(6)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
  })

  describe('filter', () => {
    it("should emit only those values from source stream that pass the provided given function", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4).filter(x => x % 2 === 0).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.with(4)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
  })

  describe('startWith', () => {
    it("should provide an initial value for a source stream", (done) => {
      const next = chai.spy()
      let firstNextValue
      Stream.of(2,3).startWith(1).subscribe(x => {
        firstNextValue = firstNextValue || x
        next(x)
      }, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.with(3)
        expect(firstNextValue).to.equal(1)
        done()
      })
    })
    it("should provide an initial sequence of values for a source stream", (done) => {
      const next = chai.spy()
      let firstNextValue
      Stream.of(3).startWith(1,2).subscribe(x => {
        firstNextValue = firstNextValue || x
        next(x)
      }, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.with(3)
        expect(firstNextValue).to.equal(1)
        done()
      })
    })
  })

  describe('scan', () => {
    it("should run the reducing function on each emitted value from source", (done) => {
      const reducer = chai.spy()
      Stream.of(1,2).scan(reducer, 0).subscribe(nx, err, () => {
        expect(reducer).to.have.been.called.with(1)
        expect(reducer).to.have.been.called.with(2)
        expect(reducer).to.have.been.called.twice()
        done()
      })
    })
    it("should emit the values coming out of the given reducing function", (done) => {
      const next = chai.spy()
      const add = (x, y) => x + y
      Stream.of(1,2,3).scan(add, 0).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(3)
        expect(next).to.have.been.called.with(6)
        expect(next).to.have.been.called.exactly(3)
        done()
      })
    })
  })

  describe('do', () => {
    it("should execute the given function with each value from source stream", (done) => {
      const fn = chai.spy()
      Stream.of(1,2).do(fn).subscribe(nx, err, () => {
        expect(fn).to.have.been.called.with(1)
        expect(fn).to.have.been.called.with(2)
        expect(fn).to.have.been.called.twice()
        done()
      })
    })
    it("should emit all values coming from source stream", (done) => {
      const next = chai.spy()
      Stream.of(1,2).do(() => {}).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
  })

  describe('single', () => {
    it("should complete", (done) => {
      Stream.never().startWith(1).single().subscribe(nx, err, done)
    })
    it("when no predicate is given should emit only the first value from source", (done) => {
      const next = chai.spy()
      Stream.of(1,2).single().subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should call the predicate with value and index", (done) => {
      const predicate = chai.spy()
      Stream.of(1,2).single(predicate).subscribe(nx, err, () => {
        expect(predicate).to.have.been.called.with(1, 0)
        expect(predicate).to.have.been.called.with(2, 1)
        expect(predicate).to.have.been.called.twice()
        done()
      })
    })
    it("should emit the first value from source to pass the predicate", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4).single(x => x === 3).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(3)
        expect(next).to.have.been.called.once()
        done()
      })
    })
  })

  describe('first', () => {
    it("should complete", (done) => {
      Stream.never().startWith(1).first().subscribe(nx, err, done)
    })
    it("when no predicate is given should emit only the first value from source", (done) => {
      const next = chai.spy()
      Stream.of(1,2).first().subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should call the predicate with value and index", (done) => {
      const predicate = chai.spy()
      Stream.of(1,2).first(predicate).subscribe(nx, err, () => {
        expect(predicate).to.have.been.called.with(1, 0)
        expect(predicate).to.have.been.called.with(2, 1)
        expect(predicate).to.have.been.called.twice()
        done()
      })
    })
    it("should emit the first value from source to pass the predicate", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4).first(x => x === 3).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(3)
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should run the given projection function with value and index", (done) => {
      const projectionFn = chai.spy()
      Stream.of(1,2,3,4).first(x => x === 3, projectionFn).subscribe(nx, err, () => {
        expect(projectionFn).to.have.been.called.with(3, 2)
        expect(projectionFn).to.have.been.called.once()
        done()
      })
    })
    it("should emit the result of the given projection function", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4).first(x => x === 4, (x, i) => `x:${x},i:${i}`).subscribe(next, err, () => {
        expect(next).to.have.been.called.with('x:4,i:3')
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should emit the given default value when no source value passed the predicate", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4).first(x => x === 7, (x, i) => `x:${x},i:${i}`, 'nothing').subscribe(next, err, () => {
        expect(next).to.have.been.called.with('nothing')
        expect(next).to.have.been.called.once()
        done()
      })
    })
  })

  describe('last', () => {
    it("should not complete until source stream completes", (done) => {
      const complete = chai.spy()
      Stream.never().startWith(1).last().subscribe(nx, err, complete)
      setTimeout(() => {
        expect(complete).to.not.have.been.called()
        done()
      })
    })
    it("should complete when source stream completes", (done) => {
      Stream.of(1,2).last().subscribe(nx, err, done)
    })
    it("when no predicate is given should emit only the last value from source", (done) => {
      const next = chai.spy()
      Stream.of(1,2).last().subscribe(next, err, () => {
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should call the predicate with value and index", (done) => {
      const predicate = chai.spy()
      Stream.of(1,2).last(predicate).subscribe(nx, err, () => {
        expect(predicate).to.have.been.called.with(1, 0)
        expect(predicate).to.have.been.called.with(2, 1)
        expect(predicate).to.have.been.called.twice()
        done()
      })
    })
    it("should emit the last value from source to pass the predicate", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4).last(x => x === 2).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should run the given projection function with value and index", (done) => {
      const projectionFn = chai.spy()
      Stream.of(1,2,3,4).last(x => x === 2, projectionFn).subscribe(nx, err, () => {
        expect(projectionFn).to.have.been.called.with(2, 1)
        expect(projectionFn).to.have.been.called.once()
        done()
      })
    })
    it("should emit the result of the given projection function", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4).last(x => x === 2, (x, i) => `x:${x},i:${i}`).subscribe(next, err, () => {
        expect(next).to.have.been.called.with('x:2,i:1')
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should emit the given default value when no source value passed the predicate", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4).last(x => x === 7, (x, i) => `x:${x},i:${i}`, 'nothing').subscribe(next, err, () => {
        expect(next).to.have.been.called.with('nothing')
        expect(next).to.have.been.called.once()
        done()
      })
    })
  })

  describe('every', () => {
    it("should complete when source stream completes", (done) => {
      Stream.of(1).every(x => x < 10).subscribe(nx, err, done)
    })
    it("should call the predicate with value and index", (done) => {
      const predicate = chai.spy()
      Stream.of(1,2).every((x, i) => {
        predicate(x, i)
        return x < 10
      }).subscribe(nx, err, () => {
        expect(predicate).to.have.been.called.with(1, 0)
        expect(predicate).to.have.been.called.with(2, 1)
        expect(predicate).to.have.been.called.twice()
        done()
      })
    })
    it("should not emit source stream values", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3).every(x => x < 10).subscribe(next, err, () => {
        expect(next).to.not.have.been.called.with(1)
        expect(next).to.not.have.been.called.with(2)
        expect(next).to.not.have.been.called.with(3)
        done()
      })
    })
    it("should emit false and complete when value fails the predicate", (done) => {
      const next = chai.spy()
      const predicate = chai.spy()
      Stream.of(1,2,3,4,5).every((x) => {
        predicate(x)
        return x === 1
      }).subscribe(next, err, () => {
        expect(predicate).to.have.been.called.with(1)
        expect(predicate).to.have.been.called.with(2)
        expect(predicate).to.have.been.called.twice()
        expect(next).to.have.been.called.with(false)
        done()
      })
    })
    it("should emit true if all values passed the predicate on completion", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3).every(x => x < 10).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(true)
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should emit true if source stream completes without emitting anything", (done) => {
      const next = chai.spy()
      Stream.empty().every(x => x < 10).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(true)
        expect(next).to.have.been.called.once()
        done()
      })
    })
  })

  describe('mapTo', () => {
    it("should emit the given value regardless of values emitted from source stream", (done) => {
      const next = chai.spy()
      Stream.of(1,2).mapTo(42).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(42)
        expect(next).to.have.been.called.with(42)
        done()
      })
    })
  })

  describe('distinctUntilChanged', () => {
    it("should emit a value from source stream if it is different from the last value emitted from source stream", (done) => {
      const next = chai.spy()
      Stream.of(1,2).distinctUntilChanged().subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        done()
      })
    })
    it("should not emit a value from source stream if it is the same as the last value emitted from source stream", (done) => {
      const next = chai.spy()
      Stream.of(1,1,1).distinctUntilChanged().subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.once()
        done()
      })
    })
  })

  describe('pluck', () => {
    it("should read the given property name from a value emitted from source stream and emit the result", (done) => {
      const next = chai.spy()
      Stream.of({name: 'Peter'}, {name: 'John'}).pluck('name').subscribe(next, err, () => {
        expect(next).to.have.been.called.with('Peter')
        expect(next).to.have.been.called.with('John')
        done()
      })
    })
  })

  describe('delay', () => {
    it("should emit values from source observable only after the given delay", (done) => {
      const next = chai.spy()
      Stream.of(1).delay(3).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        done()
      })

      expect(next).to.not.have.been.called()
      setTimeout(() => {
        expect(next).to.not.have.been.called()
      })
    })
    it("when source completes, should emit all values received from source stream and only then complete", (done) => {
      const next = chai.spy()
      const complete = chai.spy()
      const sourceComplete = chai.spy()
      const source = Stream.of(1,2)

      source.delay(3).subscribe(next, err, complete)
      source.subscribe(nx, err, sourceComplete)

      setTimeout(() => {
        expect(next).to.not.have.been.called()
        expect(complete).to.not.have.been.called()
        expect(sourceComplete).to.have.been.called()
      })

      setTimeout(() => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(complete).to.have.been.called()
        done()
      }, 5)
    })
  })

  describe('flatten', () => {
    it("should emit all values emitted from streams that were emitted from source stream", (done) => {
      const next = chai.spy()
      Stream.of(Stream.of(1,2)).flatten().subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        done()
      })
    })
    it("should error if and when a stream emitted from source stream errors", (done) => {
      Stream.of(Stream.throw()).flatten().subscribe(nx, () => done())
    })
    it("should not complete if a stream emitted from source stream completes", (done) => {
      const next = chai.spy()
      const complete = chai.spy()
      Stream.never().startWith(Stream.of(1)).flatten().subscribe(next, err, complete)
      setTimeout(() => {
        expect(next).to.have.been.called.with(1)
        expect(complete).to.not.have.been.called()
        done()
      })
    })
  })

  describe('flatMap', () => {
    it("should emit all values from streams that are returned from the given function", (done) => {
      const next = chai.spy()
      Stream.of(1, 2).flatMap(x => Stream.of(1, x * 3)).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(3)
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(6)
        expect(next).to.have.been.called.exactly(4)
        done()
      })
    })
    it("should error if and when a stream returned from the given function errors", (done) => {
      Stream.of(1).flatMap(x => Stream.throw()).subscribe(nx, () => done())
    })
    it("should not complete if a stream returned from the given function completes", (done) => {
      const next = chai.spy()
      const complete = chai.spy()
      Stream.never().startWith(1).flatMap(x => Stream.of(1)).subscribe(next, err, complete)
      setTimeout(() => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.once()
        expect(complete).to.not.have.been.called()
        done()
      })
    })
  })

  describe('switchMap', () => {
    it("should emit values from a stream that is returned from the given function", (done) => {
      const next = chai.spy()
      Stream.of(1).switchMap(x => Stream.of(1, x * 3)).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(3)
        expect(next).to.have.been.called.exactly(2)
        done()
      })
    })
    it("should stop emitting values from a stream returned from the given function once it returns another stream", (done) => {
      // this test would fail if we used flatMap instead
      const next = chai.spy()
      Stream.interval(5).switchMap(x => Stream.interval(1)).take(12).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(0)
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(next).to.not.have.been.called.with(5)
        done()
      })
    })
    it("should error if and when a stream returned from the given function errors", (done) => {
      Stream.of(1).switchMap(x => Stream.throw()).subscribe(nx, () => done())
    })
    it("should not complete if a stream returned from the given function completes", (done) => {
      const next = chai.spy()
      const complete = chai.spy()
      Stream.never().startWith(1).switchMap(x => Stream.of(1)).subscribe(next, err, complete)
      setTimeout(() => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.once()
        expect(complete).to.not.have.been.called()
        done()
      })
    })
  })

  describe('skip', () => {
    it("should not emit values from source stream before the number of values emitted is greater than the given number", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3).skip(5).subscribe(next, err, () => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
    it("should emit all values from source stream after the number of values emitted is greater than the given number", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4,5).skip(3).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(4)
        expect(next).to.have.been.called.with(5)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
  })

  describe('skipUntil', () => {
    it("should not emit before given stream emits", (done) => {
      const next = chai.spy()
      Stream.interval(1).take(20).skipUntil(Stream.never()).subscribe(next)

      setTimeout(() => {
        expect(next).to.not.have.been.called()
        done()
      }, 5)
    })
    it("should start emitting when given stream emits", (done) => {
      const next = chai.spy()
      Stream.interval(1).take(20)
        .skipUntil(Stream.interval(10).take(1))
        .subscribe(next, err, () => {
          expect(next).to.have.been.called()
          expect(next).to.not.have.been.called.with(0)
          expect(next).to.not.have.been.called.with(1)
          done()
        })
    })
    it("should not complete when given stream completes", (done) => {
      const complete = chai.spy()
      Stream.interval(1).take(20).skipUntil(Stream.empty()).subscribe(nx, err, complete)

      setTimeout(() => {
        expect(complete).to.not.have.been.called()
        done()
      }, 5)
    })
    it("should error when given stream errors", (done) => {
      const error = chai.spy()
      Stream.interval(1).take(10).skipUntil(Stream.throw('err')).subscribe(nx, error)

      setTimeout(() => {
        expect(error).to.have.been.called.with('err')
        done()
      }, 5)
    })
  })

  describe('skipWhile', () => {
    it("should call the predicate with value and index", (done) => {
      const predicate = chai.spy()
      Stream.of(1,2).skipWhile(predicate).subscribe(nx, err, () => {
        expect(predicate).to.have.been.called.with(1, 0)
        expect(predicate).to.have.been.called.with(2, 1)
        expect(predicate).to.have.been.called.twice()
        done()
      })
    })
    it("should emit all values that pass the predicate", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4).skipWhile(x => x < 5).subscribe(next, err, () => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
    it("should start emitting after some value failed the predicate", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4,5).skipWhile(x => x < 4).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(4)
        expect(next).to.have.been.called.with(5)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
    it("should keep emitting all values after some value failed the predicate even if later value passes the predicate", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3,4,5).skipWhile(x => x < 4 || x === 5).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(4)
        expect(next).to.have.been.called.with(5)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
  })

  describe('ignoreElements', () => {
    it("should emit no values", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3).ignoreElements().subscribe(next, err, () => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
  })

  describe('take', () => {
    it("should complete once the number of values emitted is equal to the given number", (done) => {
      const next = chai.spy()
      Stream.interval(1).take(2).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(0)
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
    it("should emit all values from source stream before the number of values emitted is equal to the given number", (done) => {
      const next = chai.spy()
      Stream.of(1,2).take(5).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
  })

  describe('takeUntil', () => {
    it("should emit all values from source stream before the given stream emits, then complete", (done) => {
      const next = chai.spy()
      Stream.interval(1).takeUntil(Stream.interval(3).take(1)).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(0)
        expect(next).to.not.have.been.called.with(5)
        done()
      })
    })
    it("should not complete if the given stream completes", (done) => {
      const next = chai.spy()
      const complete = chai.spy()
      const subscription = Stream.interval(1).takeUntil(Stream.never()).subscribe(next, err, complete)

      setTimeout(() => {
        expect(next).to.have.been.called.with(0)
        expect(complete).to.not.have.been.called()
        subscription.unsubscribe()
        done()
      }, 6)
    })
  })

  describe('takeWhile', () => {
    it("should complete when the given predicate evaluates to false", (done) => {
      const next = chai.spy()
      Stream.of(1).takeWhile(x => x !== 1).subscribe(next, err, () => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
    it("should emit all given values that pass the given predicate", (done) => {
      const next = chai.spy()
      Stream.of(2,4).takeWhile(x => x % 2 === 0).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.with(4)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
  })

  describe('withValue', () => {
    it("should emit an array with the value emitted from source and the value returned from the given function", (done) => {
      const next = chai.spy()
      Stream.of(1).withValue(x => x + 41).subscribe(next, err, () => {
        expect(next).to.have.been.called.with([1, 42])
        expect(next).to.have.been.called.once()
        done()
      })
    })
  })

  describe('withLatestFrom', () => {
    it("should emit an array with the value emitted from source and the latest value of the given stream", (done) => {
      const next = chai.spy()
      Stream.of(1).withLatestFrom(Stream.of(1,2,3,4,5)).subscribe(next, err, () => {
        expect(next).to.have.been.called.with([1, 5])
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should error when given stream errors", (done) => {
      Stream.of(1).withLatestFrom(Stream.throw()).subscribe(nx, () => done())
    })
  })

  describe('catch', () => {
    it("should catch and replace an error thrown in source stream", (done) => {
      const next = chai.spy()
      Stream.of(1,2,3).map(x => {
        if (x === 2)
          throw new Error()
        return x
      })
        .catch(err => Stream.of('number not processed'))
        .subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with('number not processed')
          expect(next).to.not.have.been.called.with(3)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
  })

  describe('merge', () => {
    it("should emit values coming from all merged streams", (done) => {
      const next = chai.spy()
      Stream.of(1).merge(Stream.of(2)).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
    it("should also be available as a static method", (done) => {
      const next = chai.spy()
      Stream.merge(Stream.of(1), Stream.of(2)).subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
    it("should not complete when one of the source streams completes", (done) => {
      const next = chai.spy()
      const complete = chai.spy()
      Stream.merge(Stream.of(1), Stream.never()).subscribe(next, err, complete)

      setTimeout(() => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.once()
        expect(complete).to.not.have.been.called()
        done()
      })
    })
  })

  describe('combine and combineLatest (alias)', () => {
    it("should emit an array of values containing values from all combined streams", (done) => {
      const next = chai.spy()
      Stream.of(1).combineLatest(Stream.of(2)).subscribe(next, err, () => {
        expect(next).to.have.been.called.with([1,2])
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should also be available as a static method", (done) => {
      const next = chai.spy()
      Stream.combineLatest(Stream.of(1), Stream.of(2)).subscribe(next, err, () => {
        expect(next).to.have.been.called.with([1,2])
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should not complete when one of the source streams completes", (done) => {
      const next = chai.spy()
      const complete = chai.spy()
      Stream.combineLatest(Stream.of(1), Stream.never()).subscribe(next, err, complete)

      setTimeout(() => {
        expect(complete).to.not.have.been.called()
        done()
      })
    })
    it("should not emit until every source stream emit at least once", (done) => {
      const next = chai.spy()
      Stream.combineLatest(Stream.of(1), Stream.never(), Stream.of(2)).subscribe(next)

      setTimeout(() => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
  })
})
