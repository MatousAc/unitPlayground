import { writable, get } from "svelte/store"
import Equation from '../components/Equation.svelte'

// trash stack management
export const trashStack = writable([])

export const swallow = equation => {
  console.log(equation)
  trashStack.update(list => {
    list.push(equation);
    return list
  })
}

export const vomit = dest => {
  let last = get(trashStack).pop()
  new Equation({
    props: {
      x: last.offsetX,
      y: last.offsetY,
      initLeft: last.value
    },
    target: dest
  })
}

//