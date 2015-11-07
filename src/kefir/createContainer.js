import createComponent from "./createComponent"


export default function createContainer(stateP, PureComponent) {
  return createComponent(stateP.map(PureComponent))
}
