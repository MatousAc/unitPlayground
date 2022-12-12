import './css/main.css'
import './css/bootstrap.css'
import Playground from './Playground.svelte'

// single playground
// let playground = new Playground({
//   target: document.getElementById("base")
// })

// export default playground

// multiple playgrounds
let bases = document.getElementsByClassName('base')
let playgrounds = Array.from(bases).forEach(base => {
  return new Playground({
    target: base
  })
});

export default playgrounds