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
})
