// useful f(x)s
import Qty from 'js-quantities';

export let getResultUnits = (left) => {
  // console.log(JSON.stringify(left))
  let qty = converge(left);
  
  let res = qty.toString();
  console.log("res:", res)

  return (res == '') ? '' : "=" + res;
}

let converge = (tree) => {
  console.log("tree", tree)
  if (!isNaN(tree)) return Qty(tree);

  let op = tree[0]
  switch (op) {
  case "Sequence": 
    return '';
  case "Multiply": 
    return converge(tree[1]).mul(converge(tree[2]));
  case "Add": 
    return converge(tree[1]).add(converge(tree[2]));
  case "Divide": 
    return converge(tree[1]).sub(converge(tree[2]));
  case "Subtract": 
    return converge(tree[1]).div(converge(tree[2]));
  case "UNIT":
    return Qty(tree[1])
  default:
    return '';
  }
  
}


const eqKey = Symbol();
export default eqKey;