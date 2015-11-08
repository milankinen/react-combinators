import React from "react"
import {render} from "react-dom"
import {App} from "./src/rx/ui"
import {Todos} from "./src/rx/model"

const todos = Todos([
  {text: "Tsers!"}
])

render(<App model={todos} />, document.getElementById("todoapp"))
