import createComponent from "./createComponent"
import combineVDOM from "./combineVDOM"


const Combinator = createComponent(({children}) => (
  children.flatMapLatest(combineVDOM)
))

export default Combinator
