import { writable, get } from "svelte/store"

export const trashStack = writable([])

export const swallow = equation => {
  console.log(equation)
  trashStack.update(list => {
    list.push(equation);
    return list
  })
}

export const pop = () => {
  return get(trashStack).pop();
}
