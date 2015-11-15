import Browser from "zombie"
import test from "tape"
import shell from "shelljs"
import {resolve} from "path"
import Promise from "bluebird"


const FRP_LIBS = ["rx", "bacon", "kefir"]

export function testExample(example, testCase) {
  execInExampleDir(example, "npm i")
  // this ensures that latest codes from react-combinators get installed
  execInExampleDir(example, "npm i react-combinators@file:../..")

  FRP_LIBS.forEach(lib => {
    test(`run example "${example}" with "${lib}"`, t => {
      t.comment("example initialization")
      execInExampleDir(example, `./node_modules/.bin/browserify ${lib}.js -t babelify > bundle.js`)
      const browser = polyfillBrowser(new Browser())
      Promise.resolve(browser.visit("file://" + getExampleDir(example) + "/index.html"))
        .then(() => browser.assert.success())
        .then(() => await(500))
        .then(() => testCase(t, browser))
        .finally(() => t.end())
        .done()
    })
  })
}

export function await(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function polyfillBrowser(browser) {
  browser.keyDown = function (targetSelector, keyCode) {
    const e = this.window.document.createEvent("HTMLEvents")
    e.initEvent("keydown", true, true)
    e.which = e.keyCode = keyCode
    const target = this.window.document.querySelector(targetSelector)
    target && target.dispatchEvent(e)
    return this._wait(null)
  }
  return browser
}

function execInExampleDir(example, cmd) {
  const dir = getExampleDir(example)
  const {code} = shell.exec(`cd ${dir} && ${cmd}`)
  if (code !== 0) {
    throw new Error(
      `Command ${cmd} in example ${example} had non-zero exit code`
    )
  }
}

function getExampleDir(example) {
  return resolve(__dirname, `../examples/${example}`)
}
