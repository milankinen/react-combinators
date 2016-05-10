import {testExample, awaitMs} from "./helpers"


testExample("03-editors", (t, browser) => {
  t.comment("test initial values")
  browser.assert.text("h1", "Editors 0")

  t.comment("add two counters")
  browser.click("#add")
  browser.click("#add")

  return awaitMs(50)
    .then(() => {
      t.comment("test that counters were created")
      browser.assert.text("h1", "Editors 2")
      browser.assert.elements(".counter", 2)
      browser.assert.text(".counter:nth-child(1) .val", "0")
      browser.assert.text(".counter:nth-child(2) .val", "0")
    })
    .then(() => {
      t.comment("increment counters")
      browser.click(".counter:nth-child(1) button.inc")
      browser.click(".counter:nth-child(2) button.inc")
      browser.click(".counter:nth-child(1) button.inc")
    })
    .then(() => browser.wait())
    .then(() => {
      t.comment("test that counter values were incremented")
      browser.assert.text(".counter:nth-child(1) .val", "2")
      browser.assert.text(".counter:nth-child(2) .val", "1")
    })
})
