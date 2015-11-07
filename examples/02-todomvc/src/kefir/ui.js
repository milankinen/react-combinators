import React from "react"
import {Combinator} from "react-combinators/kefir"
import Input from "./components/input"
import ToggleAll from "./components/toggleAll"
import List from "./components/list"
import Footer from "./components/footer"


export function App({model}) {
  return (
    <Combinator>
      <div>
        <header id="header">
          <h1>todos</h1>
          <Input model={model} />
        </header>
        <section id="main">
          <ToggleAll model={model} />
          <List model={model} />
        </section>
        <Footer model={model} />
      </div>
    </Combinator>
  )
}
