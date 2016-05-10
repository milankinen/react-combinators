import {testExample, awaitMs} from "./helpers"


testExample("01-bmi", (t, browser) => {
  t.comment("test initial values")
  browser.assert.input("input.Height", 180)
  browser.assert.text(".bmi", "25")
  browser.fill("input.Height", 200)
  return awaitMs(50).then(() => {
    t.comment("test changed values")
    browser.assert.input("input.Height", 200)
    browser.assert.text(".bmi", "20")
  })
})
