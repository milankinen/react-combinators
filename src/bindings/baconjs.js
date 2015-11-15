import Bacon from "baconjs"

export default {

  isObservable(obs) {
    return obs && obs instanceof Bacon.Observable
  },

  constant(val) {
    return Bacon.constant(val)
  },

  combineAsArray(arr) {
    return Bacon.combineAsArray(arr)
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
    return new Bacon.Bus()
  },

  pushToEventBus(bus, value) {
    bus.push(value)
  },

  startWith(obs, val) {
    return obs.startWith(val)
  },

  skipDuplicates(obs) {
    return obs.skipDuplicates()
  },

  subscribe(obs, onValue) {
    return obs.onValue(onValue)
  },

  toProperty(obs) {
    return obs.toProperty()
  }

}
