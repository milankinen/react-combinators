import React from "react"
import {render} from "react-dom"
import {App} from "./src/bacon/ui"
import {Todos} from "./src/bacon/model"

const todos = Todos([
  {text: "Tsers!"}
])

render(<App model={todos} />, document.getElementById("todoapp"))
