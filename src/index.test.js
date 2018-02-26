import chai from 'chai'
import spies from 'chai-spies'
import Stream from './index'
import './add/all'
import {create, subscribe} from './core'
import {
  map, filter, startWith, scan, tap, pairwise, single, first, 
  last, every, defaultIfEmpty, mapTo, distinctUntilChanged, pluck, 
  partition, delay, buffer, take, bufferWhen, bufferCount, debounce,
  debounceTime, throttle, throttleTime, flatMap, concatMap, switchMap,
  concatMapTo, skip, skipUntil, skipWhile, ignoreElements, takeUntil, takeWhile,
  withValue, withLatestFrom, catchError, merge, concat, combine, combineLatest
} from './operators'
import {
  of, error, never, empty, timer, interval, fromArray, fromEvent, fromPromise, 
  range, merge as staticMerge, concat as staticConcat, combine as staticCombine,
  combineLatest as staticCombineLatest
} from './statics'
import Rx from 'rxjs/Rx'

chai.use(spies)

const expect = chai.expect

const isStream = x => x.subscribe && x.next && x.error && x.complete
const isRootStream = x => isStream(x) && x.dependencies.length === 0

const nx = () => {}
const err = () => {}

//TODO: test default parameters
describe('subscribe', () => {
  describe('called with callbacks object', () => {
    it("should call next", (done) =>
      of(1).subscribe({next: () => done()}))

    it("should call error", (done) =>
      error().subscribe({next: nx, error: _ => done()}))

    it("should call complete", (done) =>
      of(1).subscribe({next: nx, complete: _ => done()}))

	  it("should work as a standalone function", (done) =>
	    of(1) |> subscribe({next: () => done()}))
  })
  describe('called with callback functions', () => {
    it("should call next", (done) =>
      of(1).subscribe(() => done()))

    it("should call error", (done) =>
      error().subscribe(nx, _ => done()))

    it("should call complete", (done) =>
      of(1).subscribe(nx, err, _ => done()))
  })
})

describe('getValue', () => {
	describe('should return the current value of the stream', () => {
		it("should call next", () => {
			const stream = of(1)
			stream.subscribe()
			expect(stream.getValue()).to.equal(1)
		})
	})
})

describe('factories', () => {
  describe('create', () => {
    it('should create a root stream when given no arguments', () => {
      expect(create()).to.satisfy(isRootStream)
    })
    it('should create a root stream when given a producer', () => {
      const producer = {
        start: () => {},
        stop: () => {},
      }
      expect(create(producer)).to.satisfy(isRootStream)
    })
    it('should not start a stream before anyone subscribes', () => {
      const start = chai.spy()
      const producer = {
        start,
        stop: () => {},
      }

      const s = create(producer)

      expect(producer.start).to.not.have.been.called()
    })
    it('should start a stream when first subscriber is added', () => {
      const start = chai.spy()
      const producer = {
        start,
        stop: () => {},
      }

      const s = create(producer)

      s.subscribe(() => {})

      expect(producer.start).to.have.been.called.once()
    })
  })

  describe('of', () => {
    it("should emit a given value", (done) => {
      of(42) 
        |> subscribe(x => {
          expect(x).to.equal(42)
          done()
        })
    })
    it("should complete after emitting the given value", (done) => {
      of(42) |> subscribe(() => {}, err, done)
    })
    it("should emit all given values in a sequence", (done) => {
      const next = chai.spy()

      of(1,2) 
        |> subscribe(next, err, () => {
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

      of(obj, arr, func) 
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(obj)
          expect(next).to.have.been.called.with(arr)
          expect(next).to.have.been.called.with(func)
          done()
        })
    })
  })

  describe('fromArray', () => {
    it("should complete after emitting the given value", (done) => {
      fromArray([1,2]) |> subscribe(() => {}, err, done)
    })
    it("should emit all given values in a sequence", () => {
      const next = chai.spy()

      fromArray([1,2]).subscribe(next, err, (done) => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.twice()
      })
    })
    it("should emit all given values in a sequence", (done) => {
      const next = chai.spy()

      fromArray([1,2]).subscribe(next, err, () => {
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

      fromArray([obj, arr, func]) 
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(obj)
          expect(next).to.have.been.called.with(arr)
          expect(next).to.have.been.called.with(func)
          done()
        })
    })
  })

  describe('interval', () => {
    it("should emit many values in a sequence", (done) => {
      const next = chai.spy()

      interval(1)
        |> take(2)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(0)
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()

      const stream = interval(1) |> take(2)

      stream.subscribe(next, err, () =>
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with(0)
          expect(next).to.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          done()
        }))
    })
  })

  describe('timer', () => {
    it("should complete when no second argument is given", (done) => {
      timer(1) |> subscribe(() => {}, err, done)
    })
    it("should only emit 0 when no second argument is given", (done) => {
      const next = chai.spy()

      timer(1) 
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(0)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should emit many values when the seconds argument is given", (done) => {
      const next = chai.spy()

      timer(1, 1) 
        |> take(2) 
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(0)
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()

      const stream = timer(1, 1) |> take(2)

      stream.subscribe(next, err, () =>
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with(0)
          expect(next).to.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          done()
        }))
    })
  })

  describe('range', () => {
    it("should complete", (done) => {
      range(1) |> subscribe(nx, err, done)
    })
    it("should generate and emit range values in a sequence", (done) => {
      const next = chai.spy()

      range(5,2) 
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(5)
          expect(next).to.have.been.called.with(6)
          expect(next).to.have.been.called.twice()
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

      fromEvent(fakeElement, 'fakeEventName').subscribe(next)

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

      fromEvent(fakeElement, 'fakeEventName')
        |> take(1)
        |> subscribe(next, err, () => {
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

      fromEvent(fakeElement, 'fakeEventName')
        |> map(x => {throw new Error('mapError')})
        |> subscribe(next, error => {
          expect(error.message).to.equal('mapError')
          expect(next).to.not.have.been.called()
          expect(removeEventListener).to.have.been.called.once()
          done()
        })
    })
  })

  describe('empty', () => {
    it("should immediately complete", (done) => {
      empty() |> subscribe(nx, err, done)
    })
    it("should not call subscriber's next callback", (done) => {
      const next = chai.spy()

      empty() |> subscribe(next, err, () => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
  })

  describe('error', () => {
    it("should immediately error", (done) => {
      error() |> subscribe(nx, done)
    })
    it("should not call subscriber's next callback", (done) => {
      const next = chai.spy()

      error() |> subscribe(next, () => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
    it("should not complete", (done) => {
      const complete = chai.spy()

      error() |> subscribe(nx, err, complete)

      setTimeout(() => {
        expect(complete).to.not.have.been.called()
        done()
      })
    })
  })

  describe('never', () => {
    it("should not next", (done) => {
      const next = chai.spy()

      never() |> subscribe(next)

      setTimeout(() => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
    it("should not error", (done) => {
      const error = chai.spy()

      never() |> subscribe(nx, error)

      setTimeout(() => {
        expect(error).to.not.have.been.called()
        done()
      })
    })
    it("should not complete", (done) => {
      const complete = chai.spy()

      never() |> subscribe(nx, err, complete)

      setTimeout(() => {
        expect(complete).to.not.have.been.called()
        done()
      })
    })
  })

  describe('fromPromise', () => {
    it("should call subscriber's next callback when promise is fulfilled", (done) => {
      fromPromise(Promise.resolve(42)) 
        |> subscribe(() => done())
    })
    it("should complete when promise is fulfilled", (done) => {
      fromPromise(Promise.resolve(42)) 
        |> subscribe(nx, err, done)
    })
    it("should call subscriber's error callback when promise is rejected", (done) => {
      fromPromise(Promise.reject(42)) 
        |> subscribe(nx, error => done())
    })
    it("should simply pass along anything that is not a promise", (done) => {
      const next = chai.spy()

      fromPromise(42) 
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(42)
          done()
        })
    })
    it("should work with the 'catchError' operator", (done) => {
      const next = chai.spy()
      const err = chai.spy()

      fromPromise(Promise.reject(42))
        |> catchError(error => of('caught promise error'))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with('caught promise error')
          expect(err).to.not.have.been.called()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()

      const stream = fromPromise(Promise.resolve(1))

      stream.subscribe(next, err, () => {
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.twice()
          done()
        })
      })
    })
    it("should be able to explicitly resolve to undefined", (done) => {
      const next = chai.spy()

      fromPromise(Promise.resolve(undefined))
        |> map(x => x)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(undefined)
          done()
        })
    })
  })
})

describe('operators', () => {
  describe('map', () => {
    it("should complete when source stream completes", (done) => {
      of(1,2,3)
	      .map(() => 42)
	      .subscribe(nx, err, done)
    })
    it("should error when source stream errors", (done) => {
      error()
        |> map(() => 42)
        |> subscribe(nx, done)
    })
    it("should error when mapping function errors", (done) => {
      of(1)
        |> map(() => {throw new Error()})
        |> subscribe(nx, () => done())
    })
    it("should not run the mapping function when source stream errors", (done) => {
      const mappingFn = chai.spy()

      error()
        |> map(mappingFn)
        |> subscribe(nx, _ => {
          expect(mappingFn).to.not.have.been.called()
          done()
        })
    })
    it("should run values emitted from source stream through the given mapping function", (done) => {
      const mappingFn = chai.spy()

      of(1,2)
        |> map(mappingFn)
        |> subscribe(nx, err, () => {
          expect(mappingFn).to.have.been.called.with(1)
          expect(mappingFn).to.have.been.called.with(2)
          expect(mappingFn).to.have.been.called.twice()
          done()
        })
    })
    it("should emit values coming out of it's transformation function", (done) => {
      const next = chai.spy()

      of(1,2)
        |> map(x => x * 3)
        |> subscribe(next, err, () => {
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

      of(1,2,3,4)
	      .filter(x => x % 2 === 0)
	      .subscribe(next, err, () => {
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.with(4)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should error when filtering function errors", (done) => {
      of(1)
        |> filter(() => { throw new Error() })
        |> subscribe(nx, () => done())
    })
  })

  describe('startWith', () => {
    it("should provide an initial value for a source stream", (done) => {
      const next = chai.spy()
      let firstNextValue

      of(2,3).startWith(1).subscribe(x => {
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

      of(3) |> startWith(1,2) |> subscribe(x => {
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
      of(1,2)
	      .scan(reducer, 0)
	      .subscribe(nx, err, () => {
          expect(reducer).to.have.been.called.with(1)
          expect(reducer).to.have.been.called.with(2)
          expect(reducer).to.have.been.called.twice()
          done()
        })
    })
    it("should emit the values coming out of the given reducing function", (done) => {
      const next = chai.spy()
      const add = (x, y) => x + y
      of(1,2,3)
        |> scan(add, 0)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.with(6)
          expect(next).to.have.been.called.exactly(3)
          done()
        })
    })
  })

  describe('tap', () => {
    it("should execute the given function with each value from source stream", (done) => {
      const fn = chai.spy()
      of(1,2)
	      .tap(fn)
	      .subscribe(nx, err, () => {
          expect(fn).to.have.been.called.with(1)
          expect(fn).to.have.been.called.with(2)
          expect(fn).to.have.been.called.twice()
          done()
        })
    })
    it("should emit all values coming from source stream", (done) => {
      const next = chai.spy()
      of(1,2)
        |> tap(() => {})
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
  })

  describe('pairwise', () => {
    it("should wait for 2 source emissions to start emitting", () => {
      const next = chai.spy()

      of(1)
	      .pairwise()
	      .subscribe(next, err, () => {
          expect(next).to.not.have.been.called()
        })

      of(1,2)
        |> pairwise()
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.once()
        })
    })
    it("should emit pairs of [prevValue, currentValue]", (done) => {
      const next = chai.spy()

      of(1,2,3,4)
        |> pairwise()
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1,2])
          expect(next).to.have.been.called.with([2,3])
          expect(next).to.have.been.called.with([3,4])
          expect(next).to.have.been.called.exactly(3)
          done()
        })
    })
  })

  describe('single', () => {
    it("should complete", (done) => {
      never()
	      .startWith(1)
	      .single()
	      .subscribe(nx, err, done)
    })
    it("when no predicate is given should emit only the first value from source", (done) => {
      const next = chai.spy()

      of(1,2)
        |> single()
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should call the predicate with value and index", (done) => {
      const predicate = chai.spy()

      of(1,2)
        |> single(predicate)
        |> subscribe(nx, err, () => {
          expect(predicate).to.have.been.called.with(1, 0)
          expect(predicate).to.have.been.called.with(2, 1)
          expect(predicate).to.have.been.called.twice()
          done()
        })
    })
    it("should emit the first value from source to pass the predicate", (done) => {
      const next = chai.spy()

      of(1,2,3,4)
        |> single(x => x === 3)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const predicate = chai.spy()

      const stream = of(1,2,3) |> single((x, i) => {
        predicate(i)
        return x === 2
      })

      stream.subscribe(nx, err, () =>
        stream.subscribe(nx, err, () => {
          expect(predicate).to.have.been.called.with(0)
          expect(predicate).to.have.been.called.with(1)
          expect(predicate).to.not.have.been.called.with(2)
          done()
        }))
    })
  })

  describe('first', () => {
    it("should complete", (done) => {
      never()
	      .startWith(1)
	      .first()
	      .subscribe(nx, err, done)
    })
    it("when no predicate is given should emit only the first value from source", (done) => {
      const next = chai.spy()

      of(1,2)
        |> first()
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should call the predicate with value and index", (done) => {
      const predicate = chai.spy()

      of(1,2)
        |> first(predicate)
        |> subscribe(nx, err, () => {
          expect(predicate).to.have.been.called.with(1, 0)
          expect(predicate).to.have.been.called.with(2, 1)
          expect(predicate).to.have.been.called.twice()
          done()
        })
    })
    it("should error if the given predicate errors", (done) => {
      of(1)
        |> first(x => {throw new Error()})
        |> subscribe(nx, () => done())
    })
    it("should error when resultSelector function errors", (done) => {
      of(1,2)
        |> first(x => x === 1, () => {throw new Error()})
        |> subscribe(nx, () => done())
    })
    it("should emit the first value from source to pass the predicate", (done) => {
      const next = chai.spy()

      of(1,2,3,4)
        |> first(x => x === 3)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should run the given projection function with value and index", (done) => {
      const projectionFn = chai.spy()

      of(1,2,3,4)
        |> first(x => x === 3, projectionFn)
        |> subscribe(nx, err, () => {
          expect(projectionFn).to.have.been.called.with(3, 2)
          expect(projectionFn).to.have.been.called.once()
          done()
        })
    })
    it("should emit the result of the given projection function", (done) => {
      const next = chai.spy()

      of(1,2,3,4)
        |> first(x => x === 4, (x, i) => `x:${x},i:${i}`)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with('x:4,i:3')
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should emit the given default value when no source value passed the predicate", (done) => {
      const next = chai.spy()

      of(1,2,3,4)
        |> first(x => x === 7, (x, i) => `x:${x},i:${i}`, 'nothing')
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with('nothing')
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const predicate = chai.spy()

      const stream = of(1,2,3) |> first((x, i) => {
        predicate(i)
        return x === 2
      })

      stream.subscribe(nx, err, () =>
        stream.subscribe(nx, err, () => {
          expect(predicate).to.have.been.called.with(0)
          expect(predicate).to.have.been.called.with(1)
          expect(predicate).to.not.have.been.called.with(2)
          done()
        }))
    })
  })

  describe('last', () => {
    it("should not complete until source stream completes", (done) => {
      const complete = chai.spy()

      never().startWith(1).last().subscribe(nx, err, complete)

      setTimeout(() => {
        expect(complete).to.not.have.been.called()
        done()
      })
    })
    it("should complete when source stream completes", (done) => {
      of(1,2) |> last() |> subscribe(nx, err, done)
    })
    it("when no predicate is given should emit only the last value from source", (done) => {
      const next = chai.spy()

      of(1,2) |> last() |> subscribe(next, err, () => {
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.once()
        done()
      })
    })
    it("should call the predicate with value and index", (done) => {
      const predicate = chai.spy()

      of(1,2) |> last(predicate) |> subscribe(nx, err, () => {
        expect(predicate).to.have.been.called.with(1, 0)
        expect(predicate).to.have.been.called.with(2, 1)
        expect(predicate).to.have.been.called.twice()
        done()
      })
    })
    it("should error if the given predicate errors", (done) => {
      of(1) |> last(x => {throw new Error()}) |> subscribe(nx, () => done())
    })
    it("should error when resultSelector function errors", (done) => {
      of(1,2)
        |> last(x => x === 1, () => { throw new Error() })
        |> subscribe(nx, () => done())
    })
    it("should emit the last value from source to pass the predicate", (done) => {
      const next = chai.spy()

      of(1,2,3,4) 
        |> last(x => x === 2) 
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should run the given projection function with value and index", (done) => {
      const projectionFn = chai.spy()

      of(1,2,3,4)
        |> last(x => x === 2, projectionFn)
        |> subscribe(nx, err, () => {
          expect(projectionFn).to.have.been.called.with(2, 1)
          expect(projectionFn).to.have.been.called.once()
          done()
        })
    })
    it("should emit the result of the given projection function", (done) => {
      const next = chai.spy()

      of(1,2,3,4)
        |> last(x => x === 2, (x, i) => `x:${x},i:${i}`)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with('x:2,i:1')
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should emit the given default value when no source value passed the predicate", (done) => {
      const next = chai.spy()

      of(1,2,3,4)
        |> last(x => x === 7, (x, i) => `x:${x},i:${i}`, 'nothing')
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with('nothing')
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const predicate = chai.spy()

      const stream = of(1,2,3) |> last((x, i) => {
        predicate(i)
        return x === 2
      })

      stream.subscribe(nx, err, () =>
        stream.subscribe(nx, err, () => {
          expect(predicate).to.have.been.called.with(0)
          expect(predicate).to.have.been.called.with(1)
          expect(predicate).to.have.been.called.with(2)
          expect(predicate).to.not.have.been.called.with(3)
          done()
        }))
    })
  })

  describe('every', () => {
    it("should complete when source stream completes", (done) => {
      of(1) 
	      .every(x => x < 10)
	      .subscribe(nx, err, done)
    })
    it("should call the predicate with value and index", (done) => {
      const predicate = chai.spy()

      of(1,2) 
        |> every((x, i) => {
            predicate(x, i)
            return x < 10
          }) 
        |> subscribe(nx, err, () => {
            expect(predicate).to.have.been.called.with(1, 0)
            expect(predicate).to.have.been.called.with(2, 1)
            expect(predicate).to.have.been.called.twice()
            done()
          })
    })
    it("should not emit source stream values", (done) => {
      const next = chai.spy()

      of(1,2,3)
        |> every(x => x < 10)
        |> subscribe(next, err, () => {
          expect(next).to.not.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          expect(next).to.not.have.been.called.with(3)
          done()
        })
    })
    it("should emit false and complete when value fails the predicate", (done) => {
      const next = chai.spy()
      const predicate = chai.spy()

      of(1,2,3,4,5) 
        |> every((x) => {
            predicate(x)
            return x === 1
          }) 
        |> subscribe(next, err, () => {
            expect(predicate).to.have.been.called.with(1)
            expect(predicate).to.have.been.called.with(2)
            expect(predicate).to.have.been.called.twice()
            expect(next).to.have.been.called.with(false)
            done()
          })
    })
    it("should emit true if all values passed the predicate on completion", (done) => {
      const next = chai.spy()

      of(1,2,3)
        |> every(x => x < 10)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(true)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should emit true if source stream completes without emitting anything", (done) => {
      const next = chai.spy()

      empty()
        |> every(x => x < 10)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(true)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const predicate = chai.spy()

      const stream = of(1,2,3) |> every((x, i) => {
        predicate(i)
        return x === 1
      })

      stream.subscribe(nx, err, () =>
        stream.subscribe(nx, err, () => {
          expect(predicate).to.have.been.called.with(0)
          expect(predicate).to.have.been.called.with(1)
          expect(predicate).to.not.have.been.called.with(2)
          done()
        }))
    })
  })

  describe('defaultIfEmpty', () => {
    it("should not do anything for streams that emit values", (done) => {
      const next = chai.spy()

      of(1,2)
	      .defaultIfEmpty(42)
	      .subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          expect(next).to.not.have.been.called.with(42)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should emit given value if source stream completes without emitting any values", (done) => {
      const next = chai.spy()

      of()
        |> defaultIfEmpty(42)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(42)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should work with the empty operator", (done) => {
      const next = chai.spy()

      empty()
        |> defaultIfEmpty(42)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(42)
          expect(next).to.have.been.called.once()
          done()
        })
    })
  })

  describe('mapTo', () => {
    it("should emit the given value regardless of values emitted from source stream", (done) => {
      const next = chai.spy()

      of(1,2)
	      .mapTo(42)
	      .subscribe(next, err, () => {
          expect(next).to.have.been.called.with(42)
          expect(next).to.have.been.called.with(42)
          done()
        })
    })
	  it("should handle re-subscription", (done) => {
		  const next = chai.spy()

		  const stream = of(1) |> mapTo(2)

		  stream.subscribe(next, err, () =>
			  stream.subscribe(next, err, () => {
				  expect(next).to.have.been.called.with(2)
				  expect(next).to.have.been.called.twice()
				  done()
			  }))
	  })
  })

  describe('distinctUntilChanged', () => {
    it("should emit a value from source stream if it is different from the last value emitted from source stream", (done) => {
      const next = chai.spy()

      of(1,2)
	      .distinctUntilChanged()
	      .subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          done()
        })
    })
    it("should not emit a value from source stream if it is the same as the last value emitted from source stream", (done) => {
      const next = chai.spy()

      of(1,1,1)
        |> distinctUntilChanged()
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()

      const stream = of(1,1) |> distinctUntilChanged()

      stream.subscribe(next, err, () =>
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.twice()
          done()
        }))
    })
  })

  describe('pluck', () => {
    it("should read the given property name from a value emitted from source stream and emit the result", (done) => {
      const next = chai.spy()

      of({name: 'Peter'}, {name: 'John'})
	      .pluck('name')
	      .subscribe(next, err, () => {
          expect(next).to.have.been.called.with('Peter')
          expect(next).to.have.been.called.with('John')
          done()
        })
    })
    it("should read read nested properties when given multiple parameters", (done) => {
      const next = chai.spy()

      of({person: {name: 'Peter'}}, {person: {name: 'John'}})
        |> pluck('person', 'name')
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with('Peter')
          expect(next).to.have.been.called.with('John')
          done()
        })
    })
    it("should return undefined when reading nested undefined props instead of throwing", (done) => {
      const next = chai.spy()
      const error = chai.spy()

      of(
        {name: 'Joe', age: 30, job: {title: 'Developer', language: 'JavaScript'}},
        {name: 'Sarah', age: 35}
      )
        |> pluck('job', 'title')
        |> subscribe(next, error, () => {
          expect(error).to.not.have.been.called()
          expect(next).to.have.been.called.with('Developer')
          expect(next).to.have.been.called.with(undefined)
          done()
        })
    })
  })

  describe('partition', () => {
    it("should return an array of two streams", () => {
      const result = of(1,2,3,4)
	      .partition(x => x % 2 === 0)

      expect(Array.isArray(result)).to.equal(true)
      expect(result[0]).to.satisfy(isStream)
      expect(result[1]).to.satisfy(isStream)
    })
    it("only values passing the predicate should be emitted on the first stream returned", (done) => {
      const next = chai.spy()

      const [firstStream] = of(1,2,3,4) |> partition(x => x % 2 === 0)

      firstStream |> subscribe(next, err, () => {
        expect(next).to.have.been.called.with(2)
        expect(next).to.have.been.called.with(4)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
    it("only values failing the predicate should be emitted on the second stream returned", (done) => {
      const next = chai.spy()

      const [_, secondStream] = of(1,2,3,4) |> partition(x => x % 2 === 0)

      secondStream |> subscribe(next, err, () => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(3)
        expect(next).to.have.been.called.twice()
        done()
      })
    })
  })

  describe('delay', () => {
    it("should emit values from source observable only after the given delay", (done) => {
      const next = chai.spy()

      of(1)
	      .delay(3)
	      .subscribe(next, err, () => {
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

      const source = of(1,1,2,1)

      source |> delay(3) |> subscribe(next, err, complete)
      source |> subscribe(nx, err, sourceComplete)

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

  describe('buffer', () => {
    it("should complete when source completes", (done) => {
      of(1)
	      .buffer(never())
	      .subscribe(nx, err, done)
    })
    it("should complete when given stream completes", (done) => {
      never()
        |> buffer(of(1))
        |> subscribe(nx, err, done)
    })
    it("should not emit when source emits", (done) => {
      const next = chai.spy()
      of(1,2)
        |> buffer(never())
        |> subscribe(next, err, () => {
          expect(next).to.not.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          done()
        })
    })
    it("should error if the given stream errors", (done) => {
      of(1) 
        |> buffer(error()) 
        |> subscribe(nx, done)
    })
    it("should emit buffered values as arrays when given stream emits", (done) => {
      const next = chai.spy()

      staticMerge(
        of(0, 1),
        of(2, 3) |> delay(100),
        never()
      )
        |> buffer(interval(70) |> take(2))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with([0, 1])
          expect(next).to.have.been.called.with([2, 3])
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()

      const stream = never()
        |> startWith(1, 2)
        |> buffer(timer(1))

      stream.subscribe(next, err, () =>
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1, 2])
          expect(next).to.have.been.called.with([1, 2])
          expect(next).to.have.been.called.twice()
          done()
        }))
    })
  })

  describe('bufferWhen', () => {
    it("should call the given function on initialization", (done) => {
      const fn = chai.spy()

      const subscription = never() 
	      .bufferWhen(() => {
	        fn()
	        return never()
	      })
	      .subscribe(nx)
	        expect(fn).to.have.been.called.once()
	        subscription.unsubscribe()
	        done()
	      })
    it("should complete when source completes", (done) => {
      of(1)
        |> bufferWhen(() => never())
        |> subscribe(nx, err, done)
    })
    it("should not emit when source emits", (done) => {
      const next = chai.spy()

      of(1,2)
        |> bufferWhen(() => never())
        |> subscribe(next, err, () => {
          expect(next).to.not.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          done()
        })
    })
    it("should error if the given stream errors", (done) => {
      of(1)
        |> bufferWhen(() => error())
        |> subscribe(nx, done)
    })
    it("should emit buffered values as arrays when given stream emits", (done) => {
      const next = chai.spy()

      staticMerge(
        of(0,1),
        of(2,3) |> delay(100),
        never()
      )
        |> bufferWhen(() => interval(70))
        |> take(2)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with([0,1])
          expect(next).to.have.been.called.with([2,3])
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()

      const stream = never()
        |> startWith(1,2)
        |> bufferWhen(() => timer(1))
        |> take(1)

      stream.subscribe(next, err, () =>
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1,2])
          expect(next).to.have.been.called.with([1,2])
          expect(next).to.have.been.called.twice()
          done()
        }))
    })
  })

  describe('bufferCount', () => {
    it("should complete when source completes", (done) => {
      of(1)
	      .bufferCount(1)
	      .subscribe(nx, err, done)
    })
    it("should emit buffered values as arrays when given stream emits", (done) => {
      const next = chai.spy()

      of(1,2,3,4)
        |> bufferCount(2)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1,2])
          expect(next).to.have.been.called.with([3,4])
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should ignore startBufferEvery when it's equal to bufferSize", (done) => {
      const next = chai.spy()

      of(1,2,3)
        |> bufferCount(2,2)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1,2])
          expect(next).to.have.been.called.with([3])
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should emit overlapping buffers when startBufferEvery is less bufferSize", (done) => {
      const next = chai.spy()

      of(1,2,3,4,5)
        |> bufferCount(3,1)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1,2,3])
          expect(next).to.have.been.called.with([2,3,4])
          expect(next).to.have.been.called.with([3,4,5])
          expect(next).to.have.been.called.with([4,5])
          expect(next).to.have.been.called.with([5])
          expect(next).to.have.been.called.exactly(5)
          done()
        })
    })
    it("should skip (startBufferEvery - bufferSize) number of values on each new buffer when startBufferEvery > bufferSize", (done) => {
      const next = chai.spy()

      of(1,2,3,4,5,6,7)
        |> bufferCount(3,5)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1,2,3])
          expect(next).to.have.been.called.with([6,7])
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()

      const stream = of(1,2) |> bufferCount(2)

      stream.subscribe(next, err, () =>
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1,2])
          expect(next).to.have.been.called.with([1,2])
          expect(next).to.have.been.called.twice()
          done()
        }))
    })
  })

  describe('debounce', () => {
    it("should emit value only after the interval determined by the given function passes", (done) => {
      const next = chai.spy()
      const complete = chai.spy()

      never()
	      .startWith(5)
	      .debounce(() => timer(1))
	      .subscribe(next, err, complete)

      expect(next).to.not.have.been.called()

      setTimeout(() => {
        expect(next).to.have.been.called.with(5)
        expect(complete).to.not.have.been.called()
        done()
      }, 10)
    })
    it("should work with a promise", (done) => {
      const next = chai.spy()
      const complete = chai.spy()

      never()
        |> startWith(5)
        |> debounce(x => new Promise(resolve => setTimeout(() => resolve(x), 1)))
        |> subscribe(next, err, complete)

      expect(next).to.not.have.been.called()

      setTimeout(() => {
        expect(next).to.have.been.called.with(5)
        expect(complete).to.not.have.been.called()
        done()
      }, 10)
    })
    it("when source completes, should emit last source value and complete immediately", () => {
      const next = chai.spy()
      const complete = chai.spy()

      of(1)
        |> debounce(() => timer(9999))
        |> subscribe(next, err, complete)

      expect(next).to.have.been.called.with(1)
      expect(complete).to.have.been.called()
    })
    it("should call the given function with source values", (done) => {
      const fn = chai.spy()

      of(1,2)
        |> debounce((...args) => {
          fn(...args)
          return timer(1)
        })
        |> subscribe(nx, err, () => {
          expect(fn).to.have.been.called.with(1)
          expect(fn).to.have.been.called.with(2)
          expect(fn).to.have.been.called.twice()
          done()
        })
    })
    it("should be able to dynamically adjust the interval", (done) => {
      const next = chai.spy()

      interval(50)
        |> take(8)
        |> debounce(val => timer(val * 11))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(0)
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.with(4)
          //interval returned by inner function is greater than source's interval
          expect(next).to.not.have.been.called.with(5)
          expect(next).to.not.have.been.called.with(6)
          //emitting last on source completion
          expect(next).to.have.been.called.with(7)
          done()
        })
    })
  })

  describe('debounceTime', () => {
    it("should emit value only after given interval", (done) => {
      const next = chai.spy()
      const complete = chai.spy()

      never()
	      .startWith(5)
	      .debounceTime(1)
	      .subscribe(next, err, complete)

      expect(next).to.not.have.been.called()
      setTimeout(() => {
        expect(next).to.have.been.called.with(5)
        expect(complete).to.not.have.been.called()
        done()
      }, 10)
    })
    it("when source completes, should emit last source value and complete immediately", () => {
      const next = chai.spy()
      const complete = chai.spy()

      of(1)
        |> debounceTime(9999)
        |> subscribe(next, err, complete)

      expect(next).to.have.been.called.with(1)
      expect(complete).to.have.been.called()
    })
    it("should discard values that take less than the specified time and emit the rest", (done) => {
      const next = chai.spy()

      staticMerge(
        of(1,2,3),
        of(4) |> delay(10),
        of(5) |> delay(11),
        of(6) |> delay(40)
      )
        |> debounceTime(5)
        |> subscribe(next, err, () => {
          expect(next).to.not.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          expect(next).to.have.been.called.with(3)
          expect(next).to.not.have.been.called.with(4)
          expect(next).to.have.been.called.with(5)
          expect(next).to.have.been.called.with(6)
          done()
        })
    })
  })

  describe('throttle', () => {
    it("should emit the first value immediately", () => {
      const next = chai.spy()
      const complete = chai.spy()

      never()
	      .startWith(5)
	      .throttle(() => timer(1))
	      .subscribe(next, err, complete)

      expect(next).to.have.been.called.with(5)
      expect(complete).to.not.have.been.called()
    })
    it("when source completes, should complete immediately without emitting a value", (done) => {
      const next = chai.spy()

      of(1,2,3)
        |> throttle(() => timer(9999))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          expect(next).to.not.have.been.called.with(3)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should call the given function with source values", (done) => {
      const fn = chai.spy()

      of(1,2,3)
        |> throttle((...args) => {
          fn(...args)
          return timer(1)
        })
        |> subscribe(nx, err, () => {
          expect(fn).to.have.been.called.with(1)
          expect(fn).to.have.been.called.once()
          done()
        })
    })
    it("should be able to dynamically adjust the interval", (done) => {
      const next = chai.spy()

      //emits values from 3 to 11
      const _interval = interval(100)
        |> map(x => x + 3)
        |> take(9)

      _interval
        |> throttle(x => timer(x * 40))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(3)
          // set to throttle for next 120ms
          // 100ms in - source emits 4
          expect(next).to.have.been.called.with(4) //+20ms we emit 4
          // set to throttle for next 160ms
          // 80ms in - source emits 4
          expect(next).to.have.been.called.with(5) //+80ms we emit 5
          // set to throttle for next 200ms
          // 20ms in - source emits 6
          expect(next).to.not.have.been.called.with(6) //still throttling
          // 120ms in - source emits 7
          expect(next).to.have.been.called.with(7) //+80ms we emit 7
          // set to throttle for next 280ms
          // 20ms in - source emits 8
          expect(next).to.not.have.been.called.with(8) //still throttling
          // 120ms in - source emits 9
          expect(next).to.not.have.been.called.with(9) //still throttling
          // 220ms in - source emits 10
          expect(next).to.have.been.called.with(10) //+60ms we emit 10
          // set to throttle for next 400ms
          // 40ms in - source emits 11
          expect(next).to.not.have.been.called.with(11)  //still throttling
          // source completes
          expect(next).to.have.been.called.exactly(5)
          done()
        })
    })
    it("should work with a promise", () => {
      const next = chai.spy()
      const complete = chai.spy()

      never()
        |> startWith(42)
        |> throttle(x => new Promise(resolve => setTimeout(() => resolve(x), 1)))
        |> subscribe(next, err, complete)

      expect(next).to.have.been.called.with(42)
    })
  })

  describe('throttleTime', () => {
    it("should emit the first value immediately", () => {
      const next = chai.spy()
      const complete = chai.spy()

      never()
	      .startWith(5)
	      .throttleTime(1)
	      .subscribe(next, err, complete)

      expect(next).to.have.been.called.with(5)
      expect(complete).to.not.have.been.called()
    })
    it("when source completes, should complete immediately without emitting a value", (done) => {
      const next = chai.spy()

      of(1,2,3)
        |> throttleTime(9999)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          expect(next).to.not.have.been.called.with(3)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should emit the last value every interval", (done) => {
      const next = chai.spy()

      staticMerge(
        of(1,2,3),
        of(4) |> delay(110),
        of(5) |> delay(120),
        of(6) |> delay(130),
        of(7) |> delay(300)
      )
        |> throttleTime(50)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          expect(next).to.have.been.called.with(3)
          expect(next).to.not.have.been.called.with(5)
          expect(next).to.have.been.called.with(6)
          done()
        })
    })
  })

  describe('flatMap', () => {
    it("should call the mapping function with value and index", (done) => {
      const mappingFunction = chai.spy()

      of(1,2)
	      .flatMap((...args) => {
          mappingFunction(args)
          return of(42)
        })
	      .subscribe(nx, err, () => {
          expect(mappingFunction).to.have.been.called.with([1, 0])
          expect(mappingFunction).to.have.been.called.with([2, 1])
          expect(mappingFunction).to.have.been.called.twice()
          done()
        })
    })
    it("should emit all values from streams that are returned from the given function", (done) => {
      const next = chai.spy()

      of(1, 2)
        |> flatMap(x => of(1, x * 3))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(6)
          expect(next).to.have.been.called.exactly(4)
          done()
        })
    })
    it("should emit all values from produced nested stream even if source completes", (done) => {
      const next = chai.spy()

      of(1, 2)
        |> flatMap(x => of(1, x * 3) |> delay(5))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(6)
          expect(next).to.have.been.called.exactly(4)
          done()
        })
    })
    it("should error if and when a stream returned from the given function errors", (done) => {
      of(1)
        |> flatMap(x => error())
        |> subscribe(nx, () => done())
    })
    it("should error if the given function errors", (done) => {
      of(1)
        |> flatMap(x => {throw new Error()})
        |> subscribe(nx, () => done())
    })
    it("should error when resultSelector function errors", (done) => {
      of(1,2)
        |> flatMap(x => of(4, 5) |> delay(1), () => {throw new Error()})
        |> subscribe(nx, () => done())
    })
    it("should not complete if a stream returned from the given function completes", (done) => {
      const next = chai.spy()
      const complete = chai.spy()

      never()
        |> startWith(1)
        |> flatMap(x => of(1))
        |> subscribe(next, err, complete)

      setTimeout(() => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.once()
        expect(complete).to.not.have.been.called()
        done()
      })
    })
    it("should handle promises", (done) => {
      const next = chai.spy()

      of(1,2)
        |> flatMap(x => Promise.resolve(x * 3))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.with(6)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should call the given resultSelector with outerValue, innerValue, outerIndex, and innerIndex", (done) => {
      const resultSelector = chai.spy()

      of(1,2)
        |> flatMap(x => of(4,5), (...args) => resultSelector(args))
        |> subscribe(nx, err, () => {
          expect(resultSelector).to.have.been.called.with([1, 4, 0, 0])
          expect(resultSelector).to.have.been.called.with([1, 5, 0, 1])
          expect(resultSelector).to.have.been.called.with([2, 4, 1, 0])
          expect(resultSelector).to.have.been.called.with([2, 5, 1, 1])
          expect(resultSelector).to.have.been.called.exactly(4)
          done()
        })
    })
  })

  describe('concatMap', () => {
    it("should call the mapping function with value and index", (done) => {
      const mappingFunction = chai.spy()

      of(1,2)
	      .concatMap((...args) => {
          mappingFunction(...args)
          return of(42)
        })
	      .subscribe(nx, err, () => {
          expect(mappingFunction).to.have.been.called.with(1, 0)
          expect(mappingFunction).to.have.been.called.with(2, 1)
          expect(mappingFunction).to.have.been.called.twice()
          done()
        })
    })
    it("should emit all values from streams that are returned from the given function", (done) => {
      const next = chai.spy()

      of(1, 2)
        |> concatMap(x => of(1, x * 3))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(6)
          expect(next).to.have.been.called.exactly(4)
          done()
        })
    })
    it("should emit all values from produced nested stream even if source completes", (done) => {
      const next = chai.spy()

      of(1, 2)
        |> concatMap(x => of(1, x * 3) |> delay(5))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(6)
          expect(next).to.have.been.called.exactly(4)
          done()
        })
    })
    it("should error if and when a stream returned from the given function errors", (done) => {
      of(1)
        |> concatMap(x => error())
        |> subscribe(nx, () => done())
    })
    it("should error if the given function errors", (done) => {
      of(1)
        |> concatMap(x => {throw new Error()})
        |> subscribe(nx, () => done())
    })
    it("should error when resultSelector function errors", (done) => {
      of(1,2)
        |> concatMap(x => of(4,5) |> delay(1), () => {throw new Error()})
        |> subscribe(nx, () => done())
    })
    it("should handle promises", (done) => {
      const next = chai.spy()

      of(1,2)
        |> concatMap(x => Promise.resolve(x * 3))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.with(6)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should call the given resultSelector with outerValue, innerValue, outerIndex, and innerIndex", (done) => {
      const resultSelector = chai.spy()

      of(1,2)
        |> concatMap(x => of(4,5), (...args) => resultSelector(args))
        |> subscribe(nx, err, () => {
          expect(resultSelector).to.have.been.called.with([1, 4, 0, 0])
          expect(resultSelector).to.have.been.called.with([1, 5, 0, 1])
          expect(resultSelector).to.have.been.called.with([2, 4, 1, 0])
          expect(resultSelector).to.have.been.called.with([2, 5, 1, 1])
          expect(resultSelector).to.have.been.called.exactly(4)
          done()
        })
    })
    it("should emit values from produced nested stream in strict order", (done) => {
      const resultSelector = chai.spy()
      let numberOfTimesNextCalled = 0

      of(1,2,3)
        |> concatMap(x => {
          if (x === 1)
            return of(1) |> delay(5)
          if (x === 2)
            return of(2) |> delay(1)
          if (x === 3)
            return of(3)
        }, (outerValue, innerValue, outerIndex, innerIndex) => {
          resultSelector([outerValue, innerValue, outerIndex, innerIndex])
          return innerValue
        })
        |> subscribe((x) => {
          numberOfTimesNextCalled++
          expect(x).to.equal(numberOfTimesNextCalled)
        }, err, () => {
          expect(resultSelector).to.have.been.called.with([1, 1, 0, 0])
          expect(resultSelector).to.have.been.called.with([2, 2, 1, 0])
          expect(resultSelector).to.have.been.called.with([3, 3, 2, 0])
          expect(resultSelector).to.have.been.called.exactly(3)
          done()
        })
    })
    it("should subscribe to next stream only after previous stream has completed", (done) => {
      const stream1 = of(1)
      const stream2 = of(2)

      of(1,2)
        |> concatMap(x => x === 1 ? stream1 : stream2)
        |> subscribe(x => {
          if (x === 1) {
            expect(stream1.subscribers.length).to.equal(1)
            expect(stream2.subscribers.length).to.equal(0)
          }
          if (x === 2) {
            expect(stream1.subscribers.length).to.equal(0)
            expect(stream2.subscribers.length).to.equal(1)
          }
        }, err, done)
    })
  })

  describe('switchMap', () => {
    it("should call the mapping function with value and index", (done) => {
      const mappingFunction = chai.spy()

      of(1,2)
	      .switchMap((...args) => {
          mappingFunction(args)
          return of(42)
        })
	      .subscribe(nx, err, () => {
          expect(mappingFunction).to.have.been.called.with([1, 0])
          expect(mappingFunction).to.have.been.called.with([2, 1])
          expect(mappingFunction).to.have.been.called.twice()
          done()
        })
    })
    it("should emit values from a stream that is returned from the given function", (done) => {
      const next = chai.spy()

      of(1)
        |> switchMap(x => of(1, x * 3))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.exactly(2)
          done()
        })
    })
    it("should emit all values from produced nested stream even if source completes", (done) => {
      const next = chai.spy()

      of(1, 2)
        |> switchMap(x => of(1, x * 3) |> delay(5))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(6)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should stop emitting values from a stream returned from the given function once it returns another stream", (done) => {
      // this test would fail if we used flatMap instead
      const nestedStream1 = create({start: self => self.next(1)})
      const nestedStream2 = create({
        start: self => {
          self.next(2)
          self.complete()
        }
      })

      of(1,2)
        |> switchMap(x => x === 1 ? nestedStream1 : nestedStream2)
        |> subscribe(x => {
          if (x === 1) {
            expect(nestedStream1.subscribers.length).to.equal(1)
            expect(nestedStream2.subscribers.length).to.equal(0)
          }
          if (x === 2) {
            expect(nestedStream1.subscribers.length).to.equal(0)
            expect(nestedStream2.subscribers.length).to.equal(1)
          }
        }, err, done)
    })
    it("should error if a stream returned from the given function errors", (done) => {
      of(1)
        |> switchMap(x => error())
        |> subscribe(nx, () => done())
    })
    it("should error if the given function errors", (done) => {
      of(1)
        |> switchMap(x => {throw new Error()})
        |> subscribe(nx, () => done())
    })
    it("should error when resultSelector function errors", (done) => {
      of(1,2)
        |> switchMap(x => of(4,5) |> delay(1), () => { throw new Error() })
        |> subscribe(nx, () => done())
    })
    it("should not complete if a stream returned from the given function completes", (done) => {
      const next = chai.spy()
      const complete = chai.spy()

      never()
        |> startWith(1)
        |> switchMap(x => of(1))
        |> subscribe(next, err, complete)

      setTimeout(() => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.once()
        expect(complete).to.not.have.been.called()
        done()
      })
    })
    it("should handle promises", (done) => {
      const next = chai.spy()

      of(1,2)
        |> switchMap(x => Promise.resolve(x * 3))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(6)
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should call the given resultSelector with outerValue, innerValue, outerIndex, and innerIndex", (done) => {
      const resultSelector = chai.spy()

      of(1,2)
        |> switchMap(x => of(4,5), (...args) => resultSelector(args))
        |> subscribe(nx, err, () => {
          expect(resultSelector).to.have.been.called.with([1, 4, 0, 0])
          expect(resultSelector).to.have.been.called.with([1, 5, 0, 1])
          expect(resultSelector).to.have.been.called.with([2, 4, 1, 0])
          expect(resultSelector).to.have.been.called.with([2, 5, 1, 1])
          expect(resultSelector).to.have.been.called.exactly(4)
          done()
        })
    })
  })

  describe('concatMapTo', () => {
    it("should emit all values from streams that is given", (done) => {
      const next = chai.spy()

      of(1,2)
	      .concatMapTo(of(2,3))
	      .subscribe(next, err, () => {
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.exactly(4)
          done()
        })
    })
    it("should emit all values from produced nested stream even if source completes", (done) => {
      const next = chai.spy()

      of(1,2)
        |> concatMapTo(of(2,3) |> delay(5))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.exactly(4)
          done()
        })
    })
    it("should error if the given stream errors", (done) => {
      of(1)
        |> concatMapTo(error())
        |> subscribe(nx, () => done())
    })
    it("should error when resultSelector function errors", (done) => {
      of(1,2)
        |> concatMapTo(of(4,5) |> delay(1), () => {throw new Error()})
        |> subscribe(nx, () => done())
    })
    it("should handle promises", (done) => {
      const next = chai.spy()

      of(1,2)
        |> concatMapTo(Promise.resolve(3))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should call the given resultSelector with outerValue, innerValue, outerIndex, and innerIndex", (done) => {
      const resultSelector = chai.spy()

      of(1,2)
        |> concatMapTo(of(4,5), (...args) => resultSelector(args))
        |> subscribe(nx, err, () => {
          expect(resultSelector).to.have.been.called.with([1, 4, 0, 0])
          expect(resultSelector).to.have.been.called.with([1, 5, 0, 1])
          expect(resultSelector).to.have.been.called.with([2, 4, 1, 0])
          expect(resultSelector).to.have.been.called.with([2, 5, 1, 1])
          expect(resultSelector).to.have.been.called.exactly(4)
          done()
        })
    })
  })

  describe('skip', () => {
    it("should not emit values from source stream before the number of values emitted is greater than the given number", (done) => {
      const next = chai.spy()

      of(1,2,3)
	      .skip(5)
	      .subscribe(next, err, () => {
          expect(next).to.not.have.been.called()
          done()
        })
    })
    it("should emit all values from source stream after the number of values emitted is greater than the given number", (done) => {
      const next = chai.spy()

      of(1,2,3,4,5)
        |> skip(3)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(4)
          expect(next).to.have.been.called.with(5)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()

      const stream = of(1,2) |> skip(1)

      stream.subscribe(next, err, () =>
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with(2)
          expect(next).to.not.have.been.called.with(1)
          done()
        }))
    })
  })

  describe('skipUntil', () => {
    it("should not emit before given stream emits", (done) => {
      const next = chai.spy()

      of(1,2,3)
	      .skipUntil(never())
	      .subscribe(next, err, () => {
          expect(next).to.not.have.been.called()
          done()
        })
    })
    it("should start emitting when given stream emits", (done) => {
      const next = chai.spy()

      staticMerge(of(1,2), timer(10))
        |> skipUntil(timer(1))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(0)
          expect(next).to.not.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          done()
        })
    })
    it("should not complete when given stream completes", (done) => {
      const complete = chai.spy()

      never()
        |> skipUntil(empty())
        |> subscribe(nx, err, complete)

      setTimeout(() => {
        expect(complete).to.not.have.been.called()
        done()
      })
    })
    it("should error when given stream errors", () => {
      const err = chai.spy()

      never()
        |> skipUntil(error('err'))
        |> subscribe(nx, err)

      expect(err).to.have.been.called.with('err')
    })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()

      const stream = staticMerge(of(1,2), timer(10)) |> skipUntil(timer(1))

      stream.subscribe(next, err, () =>
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with(0)
          expect(next).to.not.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          done()
        }))
    })
  })

  describe('skipWhile', () => {
    it("should call the predicate with value and index", (done) => {
      const predicate = chai.spy()

      of(1,2)
	      .skipWhile(predicate)
	      .subscribe(nx, err, () => {
          expect(predicate).to.have.been.called.with(1, 0)
          expect(predicate).to.have.been.called.with(2, 1)
          expect(predicate).to.have.been.called.twice()
          done()
        })
    })
    it("should emit all values that pass the predicate", (done) => {
      const next = chai.spy()

      of(1,2,3,4)
        |> skipWhile(x => x < 5)
        |> subscribe(next, err, () => {
          expect(next).to.not.have.been.called()
          done()
        })
    })
    it("should start emitting after some value failed the predicate", (done) => {
      const next = chai.spy()

      of(1,2,3,4,5)
        |> skipWhile(x => x < 4)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(4)
          expect(next).to.have.been.called.with(5)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should keep emitting all values after some value failed the predicate even if later value passes the predicate", (done) => {
      const next = chai.spy()

      of(1,2,3,4,5)
        |> skipWhile(x => x < 4 || x === 5)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(4)
          expect(next).to.have.been.called.with(5)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()
      const predicate = chai.spy()

      const stream = of(1,2,3,4,5) |> skipWhile((x, i) => {
        predicate(i)
        return x < 4
      })

      stream.subscribe(next, err, () =>
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with(4)
          expect(next).to.have.been.called.with(5)
          expect(next).to.not.have.been.called.with(1)
          expect(next).to.not.have.been.called.with(2)
          expect(next).to.not.have.been.called.with(3)
          expect(predicate).to.have.been.called.with(0)
          expect(predicate).to.have.been.called.with(1)
          expect(predicate).to.have.been.called.with(2)
          expect(predicate).to.have.been.called.with(3)
          expect(predicate).to.not.have.been.called.with(4)
          done()
        }))
    })
  })

  describe('ignoreElements', () => {
    it("should emit no values", (done) => {
      const next = chai.spy()

      of(1,2,3)
	      .ignoreElements()
	      .subscribe(next, err, () => {
          expect(next).to.not.have.been.called()
          done()
        })
    })
  })

  describe('take', () => {
    it("should complete once the number of values emitted is equal to the given number", (done) => {
      const next = chai.spy()

      of(1,2,3)
	      .take(2)
	      .subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should emit all values from source stream before the number of values emitted is equal to the given number", (done) => {
      const next = chai.spy()

      of(1,2)
        |> take(5)
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()

      const stream = of(1,2,3) |> take(2)

      stream.subscribe(next, err, () =>
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          expect(next).to.not.have.been.called.with(3)
          expect(next).to.have.been.called.exactly(4)
          done()
        }))
    })
  })

  describe('takeUntil', () => {
    it("should emit all values from source stream before the given stream emits, then complete", (done) => {
      const next = chai.spy()

      never()
	      .startWith(1,2)
	      .takeUntil(timer(1))
	      .subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should not complete if the given stream doesn't emit", (done) => {
      const next = chai.spy()
      const complete = chai.spy()

      const subscription = never()
        |> startWith(1,2)
        |> takeUntil(never())
        |> subscribe(next, err, complete)

      setTimeout(() => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.with(2)
        expect(complete).to.not.have.been.called()
        subscription.unsubscribe()
        done()
      })
    })
  })

  describe('takeWhile', () => {
    it("should complete when the given predicate evaluates to false", (done) => {
      const next = chai.spy()

      of(1)
	      .takeWhile(x => x !== 1)
	      .subscribe(next, err, () => {
          expect(next).to.not.have.been.called()
          done()
        })
    })
    it("should emit all given values that pass the given predicate", (done) => {
      const next = chai.spy()

      of(2,4)
        |> takeWhile(x => x % 2 === 0)
        |> subscribe(next, err, () => {
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

      of(1)
	      .withValue(x => x + 41)
	      .subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1, 42])
          expect(next).to.have.been.called.once()
          done()
        })
    })
	  it("should handle re-subscription", (done) => {
		  const next = chai.spy()

		  const stream = of(1) |> withValue(_ => 2)

		  stream.subscribe(next, err, () =>
			  stream.subscribe(next, err, () => {
				  expect(next).to.have.been.called.with([1, 2])
				  expect(next).to.have.been.called.twice()
				  done()
			  }))
	  })
  })

  describe('withLatestFrom', () => {
    it("should emit an array with the value emitted from source and the latest value of the given stream", (done) => {
      const next = chai.spy()

      of(1)
	      .withLatestFrom(of(1,2,3,4,5))
	      .subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1, 5])
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should error when given stream errors", (done) => {
      of(1)
        |> withLatestFrom(error())
        |> subscribe(nx, () => done())
    })
  })

  describe('catchError', () => {
    it("should catch and replace an error thrown in source stream", (done) => {
      const next = chai.spy()

      of(1,2,3)
	      .map(x => {
          if (x === 2)
            throw new Error()
          return x
        })
	      .catchError(err => of('number not processed'))
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

      of(1)
	      .merge(of(2))
	      .subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should not wait for all dependency stream to emit", (done) => {
      const next = chai.spy()

      never() |> merge(of(1)) |> subscribe(next)

      expect(next).to.have.been.called.with(1)
      done()
    })
    it("should also be available as a static method", (done) => {
      const next = chai.spy()

      staticMerge(of(1), of(2))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should not complete when one of the source streams completes", (done) => {
      const next = chai.spy()
      const complete = chai.spy()

      staticMerge(of(1), never()) |> subscribe(next, err, complete)

      setTimeout(() => {
        expect(next).to.have.been.called.with(1)
        expect(next).to.have.been.called.once()
        expect(complete).to.not.have.been.called()
        done()
      })
    })
  })

  describe('concat', () => {
    it("should complete when all sources stream complete", (done) => {
      of(1)
	      .concat(of(2))
	      .subscribe(nx, err, done)
    })
    it("should also be available as a static method", (done) => {
      staticConcat(of(1), of(2)) 
        |> subscribe(nx, err, done)
    })
    it("should emit values from all given streams in a sequence", (done) => {
      const next = chai.spy()

      staticConcat(of(1), of(2))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should subscribe to next stream only after previous stream has completed", (done) => {
      const stream1 = of(1)
      const stream2 = of(2)

      staticConcat(stream1, stream2)
        |> subscribe(x => {
          if (x === 1) {
            expect(stream1.subscribers.length).to.equal(1)
            expect(stream2.subscribers.length).to.equal(0)
          }
          if (x === 2) {
            expect(stream1.subscribers.length).to.equal(0)
            expect(stream2.subscribers.length).to.equal(1)
          }
        }, err, done)
    })
  })

  describe('pipe', () => {
    it("should work when called with a pipeable operator", (done) => {
      const next = chai.spy()

      Stream.of(1,2)
	      .pipe(map(x => x + 1))
        .subscribe(next, err, () => {
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.with(3)
          expect(next).to.have.been.called.twice()
          done()
        })
    })
    it("should handle piping through multiple operators", (done) => {
      const next = chai.spy()

      Stream.of(0,1,2,3,4)
        .pipe(
          map(x => x + 1),
          filter(x => x % 2 === 0)
        )
        .subscribe(next, err, () => {
          expect(next).to.have.been.called.with(2)
          expect(next).to.have.been.called.with(4)
          expect(next).to.have.been.called.twice()
          done()
      })
    })
	  it("should error when one of the given streams errors", (done) => {
		  of(1,2,3,4,5).pipe(
			  map(x => x + 1),
			  filter(x => x % 2 === 0),
			  map(x => {
			  	if (x === 2)
			  		throw new Error('error')
				  else
				  	return x
			  }),
			  take(3)
		  )
			  .subscribe(nx, () => done())
	  })
    it("should handle re-subscription", (done) => {
      const next = chai.spy()

      const stream = Stream.of(1,2).pipe(map(x => x))

      stream.subscribe(next, err, () =>
        stream.subscribe(next, err, () => {
          expect(next).to.have.been.called.with(1)
          expect(next).to.have.been.called.with(2)
          expect(next).to.not.have.been.called.with(3)
          expect(next).to.have.been.called.exactly(4)
          done()
        }))
    })
  })

  describe('combine and combineLatest (alias)', () => {
    it("should emit an array of values containing values from all combined streams", (done) => {
      const next1 = chai.spy()
      const next2 = chai.spy()
      const next3 = chai.spy()
      const next4 = chai.spy()

      of(1)
	      |> combineLatest(of(2))
	      |> subscribe(next1, err, () => {
          expect(next1).to.have.been.called.with([1,2])
          expect(next1).to.have.been.called.once()
        })

      //alias
      of(1)
        |> combine(of(2))
        |> subscribe(next2, err, () => {
          expect(next2).to.have.been.called.with([1,2])
          expect(next2).to.have.been.called.once()
        })

	    //as methods
	    of(1)
		    .combineLatest(of(2))
		    .subscribe(next3, err, () => {
			    expect(next3).to.have.been.called.with([1,2])
			    expect(next3).to.have.been.called.once()
		    })
	    of(1)
		    .combine(of(2))
		    .subscribe(next4, err, () => {
			    expect(next4).to.have.been.called.with([1,2])
			    expect(next4).to.have.been.called.once()
			    done()
		    })
    })
    it("should also be available as a static method", (done) => {
      const next = chai.spy()

      staticCombineLatest(of(1), of(2))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1,2])
          expect(next).to.have.been.called.once()
          done()
        })

      //alias
      staticCombine(of(1), of(2))
        |> subscribe(next, err, () => {
          expect(next).to.have.been.called.with([1,2])
          expect(next).to.have.been.called.once()
          done()
        })
    })
    it("should not complete when one of the source streams completes", (done) => {
      const next = chai.spy()
      const complete = chai.spy()

      staticCombineLatest(of(1), never())
        |> subscribe(next, err, complete)

      setTimeout(() => {
        expect(complete).to.not.have.been.called()
        done()
      })
    })
    it("should not emit until every source stream emit at least once", (done) => {
      const next = chai.spy()

      staticCombineLatest(of(1), never(), of(2)).subscribe(next)

      setTimeout(() => {
        expect(next).to.not.have.been.called()
        done()
      })
    })
  })
})

describe('generic', () => {
  it("should complete the stream when last subscriber unsubscribes", (done) => {
    const stream = interval(999)

    const subscription = stream.subscribe(nx)

    setTimeout(() => {
      subscription.unsubscribe()
      expect(stream.active).to.equal(false)
      done()
    })
  })
  it("should complete dependencies when stream completes if the completed stream was the only dependent", (done) => {
    const doBlock = chai.spy()
    const stream1 = interval(10) |> tap(doBlock)
    const stream2 = stream1 |> map(x => x * 2)
    const stream3 = stream2 |> filter(x => x % 2 === 0)
    const stream4 = stream3 |> take(15)

    stream4.subscribe(nx, err, () => {
      expect(doBlock).to.have.been.called.with(10)
      expect(doBlock).to.not.have.been.called.with(16)
      expect(stream1.active).to.equal(false)
      expect(stream2.active).to.equal(false)
      expect(stream3.active).to.equal(false)
      expect(stream4.active).to.equal(false)
      done()
    })
  })
  it("should not complete the stream when last subscriber unsubscribes in case stream has other dependents", (done) => {
    const stream = interval(1)
    const someDependentStream = stream |> take(20)

    someDependentStream.subscribe(nx)

    const subscription = stream.subscribe(nx)

    setTimeout(() => {
      subscription.unsubscribe()
      expect(stream.active).to.equal(true)
      expect(someDependentStream.active).to.equal(true)
      done()
    })
  })
  it("should set stream's hasEmitted flag to true after that stream actually emitted", (done) => {
    const stream = of(1,2,3)
    const filteredStream = stream |> filter(x => x > 5)

    stream.subscribe(nx, err, () => expect(stream.hasEmitted).to.equal(true))

    filteredStream.subscribe(nx, err, () =>
      expect(filteredStream.hasEmitted).to.equal(false))

    setTimeout(done)
  })
  it("should work with RxJS's from method", (done) => {
    const next = chai.spy()

    const stream = interval(1).take(2)

    Rx.Observable.from(stream).subscribe(next, err, () => {
      expect(next).to.have.been.called.with(0)
      expect(next).to.have.been.called.with(1)
      expect(next).to.have.been.called.twice()
      done()
    })
  })
})

describe('check statics and operators are available as methods', () => {
	const isFunction = x => typeof x === 'function'
	const isAvailableAsStatic = method => expect(isFunction(Stream[method])).to.equal(true)
	const isAvailableAsMethod = method => expect(isFunction(of(1)[method])).to.equal(true)

	const statics = ['of', 'fromArray', 'timer', 'range', 'fromEvent', 'empty', 'error', 'never', 'fromPromise']
	const operators = ['map', 'filter', 'startWith', 'scan', 'tap', 'pairwise', 'single', 'first', 'last', 'every', 'defaultIfEmpty', 'mapTo', 'distinctUntilChanged', 'pluck', 'partition', 'delay', 'buffer', 'bufferWhen', 'bufferCount', 'debounce', 'debounceTime', 'throttle', 'throttleTime', 'flatMap', 'concatMap', 'switchMap', 'concatMapTo', 'skip', 'skipUntil', 'skipWhile', 'ignoreElements', 'take', 'takeUntil', 'takeWhile', 'withValue', 'withLatestFrom', 'catchError', 'merge', 'concat', 'combine', 'combineLatest']

	statics.forEach(x => it(x, () => isAvailableAsStatic(x)))
	operators.forEach(x => it(x, () => isAvailableAsMethod(x)))
})
