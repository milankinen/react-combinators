
export default (createComponent, combineVDOM, {flatMapLatest}) => (
  createComponent(({children}) => (
    flatMapLatest(children, combineVDOM)
  ))
)
