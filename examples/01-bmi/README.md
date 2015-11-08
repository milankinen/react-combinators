# BMI counter example

This is the basic example how to use React observable combinators.
It shows how to use `<Combinator>` elements and how to embed observables
to the JSX. Note that `<Combinator>` element is used only in `App` 
function because it is the root of the `React.Element`.

If `renderSlider` functions were replaced with `<Slider>` elements, then
those elements would require their own `<Combinator>` wrappers. However,
react combinators encourage you to create just "render functions" and 
declare the vdom only by using them.


Examples codes (per supported FRP library) can be found from files:

* `rx.js`
* `bacon.js`
* `kefir.js`

## Usage

    npm i 
    npm run rx
    npm run baconjs
    npm run kefir
    
    
