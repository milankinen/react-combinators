import createComponent from "./createComponent"
import combineVDOM from "./combineVDOM"


/**
 * Usage:
 *
 * <Combinator>
 *   ...reactive vdom here...
 * </Combinator>
 */
const Combinator = createComponent(({children}) => (
  children.flatMapLatest(combineVDOM)
))

export default Combinator
