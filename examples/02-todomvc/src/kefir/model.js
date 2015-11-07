import Kefir from "kefir"

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
    items.flatMapLatest(getItemsWithStatus).toProperty()

  const displayedItems = Kefir.combine([itemsWithCurrentStatus, filter],
    (todos, f) => todos.filter(({status}) => !f || status === f).map(({item}) => item)
  ).toProperty()

  const totalItems = items.map(items => items.length).toProperty()

  const itemsLeft =
    itemsWithCurrentStatus.map(items => items.filter(({status}) => status === "active").length).toProperty()

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
      return Kefir.combine(items.map(item => item.fields.map(it => it.status).map(status => ({status, item}))))
    } else {
      return Kefir.constant([])
    }
  }
}

export function Todo({text = "", status = "active", id = Date.now()}) {
  const fields = Model({text, status})
  const setText = text => fields.modify(fields => ({...fields, text}))
  const setStatus = status => fields.modify(fields => ({...fields, status}))
  return { id, fields, setText, setStatus }
}


export function Model(initial) {
  let current = undefined
  const pool = Kefir.pool()
  const model = pool.scan((state, fn) => fn(state), initial).toProperty()
  model.onValue(val => current = val)
  model.set = val => pool.plug(Kefir.constant(_ => val))
  model.get = () => current
  model.modify = fn => pool.plug(Kefir.constant(fn))
  return model
}
