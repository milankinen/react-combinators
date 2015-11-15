import {Observable, Subject} from "rx"

export default {

  isObservable(obs) {
    return obs && obs instanceof Observable
  },

  constant(val) {
    return Observable.just(val).shareReplay()
  },

  combineAsArray(arr) {
    return Observable.combineLatest(...arr)
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
    return new Subject()
  },

  pushToEventBus(bus, value) {
    bus.onNext(value)
  },

  startWith(obs, val) {
    return obs.startWith(val)
  },

  skipDuplicates(obs) {
    return obs.distinctUntilChanged()
  },

  subscribe(obs, onValue) {
    const disposable = obs.subscribe(onValue)
    return function dispose() {
      return disposable.dispose()
    }
  },

  toProperty(obs) {
    return obs.shareReplay()
  }

}
