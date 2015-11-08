import {Observable, Subject} from "rx"

export function Todos(initialItems) {
  const items = Model(initialItems.map(Todo))
  const filter = Model("")

  const addItem = text => {
    items.modify(todos => [...todos, Todo({text})])
  }
  const removeItem = id => {
    items.modify(todos => todos.filter(t => t.id !== id))
  }
  const setStatusForAllItems = status => {
    items.modify(items => {
      items.forEach(it => it.setStatus(status))
      return items
    })
  }
  const resetFilter = newValue => {
    filter.set(newValue)
  }
  const clearCompletedItems = () => {
    items.modify(items => items.filter(t => t.fields.get().status !== "completed"))
  }

  const itemsWithCurrentStatus =
    items.flatMapLatest(getItemsWithStatus).share()

  const displayedItems = Observable.combineLatest(itemsWithCurrentStatus, filter,
    (todos, f) => todos.filter(({status}) => !f || status === f).map(({item}) => item)
  ).share()

  const totalItems = items.map(items => items.length).share()

  const itemsLeft =
    itemsWithCurrentStatus.map(items => items.filter(({status}) => status === "active").length).share()

  return {
    items,
    addItem,
    removeItem,
    setStatusForAllItems,
    clearCompletedItems,
    resetFilter,
    displayedItems,
    totalItems,
    itemsLeft,
    filter
  }

  function getItemsWithStatus(items) {
    if (items.length) {
      return Observable.combineLatest(...items.map(item => item.fields.map(it => it.status).map(status => ({status, item}))))
    } else {
      return Observable.just([])
    }
  }
}

export function Todo({text = "", status = "active", id = Date.now()}) {
  const fields = Model({text, status})
  const setText = text => fields.modify(fields => ({...fields, text}))
  const setStatus = status => fields.modify(fields => ({...fields, status}))
  return {id, fields, setText, setStatus}
}


export function Model(initial) {
  let current = undefined
  const subject = new Subject()
  const model = subject.startWith(initial).scan((state, fn) => fn(state)).shareReplay()
  model.subscribe(val => current = val)
  model.set = val => subject.onNext(_ => val)
  model.get = () => current
  model.modify = fn => subject.onNext(fn)
  return model
}
