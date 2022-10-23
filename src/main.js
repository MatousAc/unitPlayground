import './css/main.css'
import Playground from './Playground.svelte'

// let playground = new Playground({
//   target: document.getElementById("base")
// })

// export default playground

let bases = document.getElementsByClassName('base')
let playgrounds = Array.from(bases).forEach(base => {
  return new Playground({
    target: base
  })
});

export default playgrounds
