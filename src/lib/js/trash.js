/// handles trash stack management ///
import { writable, get } from 'svelte/store'
import Equation from '$pc/Equation.svelte'
import Fragment from '$pc/Fragment.svelte'
import { playground } from '$pj/stores'

// FIXME store trash stack in supabase
// also store current playground in supabase
export const trashStack = writable([])
export const swallow = component => {
  trashStack.update(list => {
    list.push(component)
    return list
  })
}

export const vomit = () => {
  let last = get(trashStack).pop()
  let props = {
    props: {
      x: last.offsetX,
      y: last.offsetY,
      initVal: last.value
    },
    target: get(playground)
  }
  switch (last.component) {
    case 'Equation':
      new Equation(props)
      break
    case 'Fragment':
      new Fragment(props)
      break
  }
}
