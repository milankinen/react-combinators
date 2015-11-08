# Editor list

Polymorphic lists and their state manipulation is challenging with single-reducer
Flux architectures. With observables and combinators, these kind of lists become
trivial to handle: each list element can have its own state model that that is
rendered with combinators.

In this example, it's possible to add either "counters" or "name editors" to the
editor list. Each counter/name editor have its own state model and render function
so the `App` must only loop through the list and call render function to each 
counter/editor. 

Examples codes (per supported FRP library) can be found from files:

* `rx.js`
* `bacon.js`
* `kefir.js`

## Usage

    npm i 
    npm run rx
    npm run baconjs
    npm run kefir
    
