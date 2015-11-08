import Bacon from "baconjs"
import {Model} from "bacon.model"

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
    items.flatMapLatest(items => Bacon.combineAsArray(
        items.map(item => item.fields.map(".status").map(status => ({status, item})))
    )).toProperty()

  const displayedItems = Bacon.combineWith(
    itemsWithCurrentStatus,
    filter,
    (todos, f) => todos.filter(({status}) => !f || status === f).map(({item}) => item)
  )

  const totalItems = items.map(".length")

  const itemsLeft =
    itemsWithCurrentStatus.map(items => items.filter(({status}) => status === "active").length)

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
}

export function Todo({text = "", status = "active", id = Date.now()}) {
  const fields = Model({text, status})
  const setText = text => fields.modify(fields => ({...fields, text}))
  const setStatus = status => fields.modify(fields => ({...fields, status}))
  return { id, fields, setText, setStatus }
}
