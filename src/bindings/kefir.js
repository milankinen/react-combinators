import Kefir from "kefir"

export default {

  isObservable(obs) {
    return obs && obs instanceof Kefir.Observable
  },

  constant(val) {
    return Kefir.constant(val)
  },

  combineAsArray(arr) {
    return Kefir.combine(arr)
  },

  map(obs, fn) {
    return obs.map(fn)
  },

  flatMapLatest(obs, fn) {
    return obs.flatMapLatest(fn)
  },

  take(obs, num) {
    return obs.take(num)
  },

  createEventBus() {
    return Kefir.pool()
  },

  pushToEventBus(bus, value) {
    bus.plug(Kefir.constant(value))
  },

  startWith(obs, val) {
    // TODO: is there better way to do this??
    return obs.merge(Kefir.constant(val))
  },

  skipDuplicates(obs) {
    return obs.skipDuplicates()
  },

  subscribe(obs, onValue) {
    obs.onValue(onValue)
    return function dispose() {
      obs.offValue(onValue)
    }
  },

  toProperty(obs) {
    return obs.toProperty()
  }

}
