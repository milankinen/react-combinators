import React from "react"
import {render} from "react-dom"
import {App} from "./src/kefir/ui"
import {Todos} from "./src/kefir/model"

const todos = Todos([
  {text: "Tsers!"}
])

render(<App model={todos} />, document.getElementById("todoapp"))
