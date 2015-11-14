import {testExample} from "./helpers"


testExample("02-todomvc", (t, browser) => {
  t.comment("test initial values")
  browser.assert.input("#new-todo", "")
  browser.assert.elements("#todo-list li", 1)

  return addNewItem("some text")
    .then(() => browser.wait())
    .then(() => {
      t.comment("test that new item was added")
      browser.assert.text("#todo-list li:last-child label", "some text")
      browser.assert.text("#todo-count", "2 items left")
      browser.assert.elements("#todo-list li", 2)

    })
    .then(() => {
      t.comment("test that toggling item status works")
      return browser.check("#todo-list li:first-child input.toggle")
    })
    .then(() => browser.wait())
    .then(() => {
      browser.assert.hasClass("#todo-list li:first-child", "completed")
      browser.assert.text("#todo-count", "1 item left")
      browser.assert.elements("#todo-list li", 2)
    })
    .then(() => {
      t.comment("test that clearing completed items works")
      return browser.click("#clear-completed").then(() => browser.wait())
    })
    .then(() => {
      t.comment("test that completed item has removed from the list")
      browser.assert.elements("#todo-list li", 1)
    })


  function addNewItem(text) {
    t.comment("add new item")
    browser.fill("#new-todo", text)
    return browser.keyDown("#new-todo", 13)  // == enter
  }
})
