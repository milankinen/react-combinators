import makeCombineVDOM from "./combineVDOM"
import makeCombinator from "./Combinator"
import makeCreateComponent from "./createComponent"


export default bindings => {
  const combineVDOM = makeCombineVDOM(bindings)
  const createComponent = makeCreateComponent(bindings)
  const Combinator = makeCombinator(createComponent, combineVDOM, bindings)

  return { combineVDOM, Combinator, createComponent }
}
