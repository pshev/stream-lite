import chai from 'chai'
import spies from 'chai-spies'
import '../add/all'
import Stream from '../'

chai.use(spies)

const expect = chai.expect

const isStream = x => x.subscribe && x.next && x.error && x.complete
const isRootStream = x => isStream(x) && x.dependencies.length === 0
const isDependentStream = x => isStream(x) && x.dependencies.length > 0

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
      const startSpy = chai.spy()
      const producer = {
        start: startSpy,
        stop: () => {},
      }

      const s = Stream.create(producer)

      expect(producer.start).to.not.have.been.called()
    })
    it('should start a stream when first subscriber is added', () => {
      const startSpy = chai.spy()
      const producer = {
        start: startSpy,
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
      Stream.of(42).subscribe(() => {}, err => {}, () => {
        done()
      })
    })
    it("should emit all given values in a sequence", (done) => {
      const spy = chai.spy()
      Stream.of(1, 2, 3).subscribe(spy, err => {}, () => {
        expect(spy).to.have.been.called.with(1)
        expect(spy).to.have.been.called.with(2)
        expect(spy).to.have.been.called.with(3)
        done()
      })
    })
    it("should handle emitting objects, array, and functions", (done) => {
      const spy = chai.spy()

      const obj = {name: 'Joe'}
      const arr = [1,2,3]
      const func = () => 'hello'

      Stream.of(obj, arr, func).subscribe(spy, err => {}, () => {
        expect(spy).to.have.been.called.with(obj)
        expect(spy).to.have.been.called.with(arr)
        expect(spy).to.have.been.called.with(func)
        done()
      })
    })
  })

  describe('fromPromise', () => {
    it("should call subscriber's next callback when promise is fulfilled", (done) => {
      Stream.fromPromise(Promise.resolve(42)).subscribe(() => {
        expect(true).to.equal(true)
        done()
      })
    })
    it("should call subscriber's error callback when promise is rejected", (done) => {
      Stream.fromPromise(Promise.reject(42)).subscribe(() => {}, error => {
        expect(true).to.equal(true)
        done()
      })
    })
  })
})
