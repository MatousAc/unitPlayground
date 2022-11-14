// useful f(x)s
import Qty from 'js-quantities';

var latexFormatter = function(significantDigits = 2, includeScalar = false) {
  return function(scalar, units) {
    // scalar string generation
    scalar = includeScalar ? `${+scalar.toFixed(significantDigits)}` : ''
    if (units == '' || units == null) return scalar;

    // getting the right unit format for latex
    units = units.match(RegExp('[A-Za-z]+[0-9]*[\s/]?', 'g'))
    units = units.map(unit => {
      let parts = unit.match(RegExp('[a-zA-Z/]+|[0-9/]+', 'g'))
      if (parts == null) return unit;
      console.log(`parts of ${unit}: ${parts}`)
      return parts.join("^")
    });
    units = `\\${units.join('\\')}`
    let frac = units.split('/')
    units = frac.length === 2 ? `\\frac{${frac[0]}}{${frac[1]}}` : units
    return scalar + units;
  };
};

export let getResultUnits = (json) => {
  console.log("stringified: ", JSON.stringify(json))
  if (inProgress(JSON.stringify(json))) { return '' }
  let res = '';
  try {
    let qty = converge(json);
    res = qty.format(latexFormatter(3, true));
    console.log("res:", res)
  } catch (e) {
    console.error(e.message)
  }
  

  return (res == '') ? '' : "=" + res;
}


// let q = Qty("m");
// let fxs = {
//   "Multiply": q.mul,
//   "Add": q.add,
//   "Divide": q.div,
//   "Subtract": q.sub
// }

let converge = (tree) => {
  console.log("tree", tree)
  if (!Array.isArray(tree)) return Qty(tree);

  
  // if (fxs.hasOwnProperty(op)) {
  //   return tree.slice(1, -1).reduce((a, b) => 
  //     // @ts-ignore
  //     converge(a).call([op], (converge(b))
  //   );
  // }

  // I NEEEEED TO REMOVE THE DUPLICATED CODE HERE :'(
  let op = tree[0]
  switch (op) {
  case "Multiply": 
    return tree.slice(1).reduce((a, b) => 
      converge(a).mul(converge(b))
    );
  case "Add": 
    return tree.slice(1).reduce((a, b) => 
      converge(a).add(converge(b))
    );
  case "Divide": 
  case "Rational": 
    return tree.slice(1).reduce((a, b) => 
      converge(a).div(converge(b))
    );
  case "Subtract": 
    return tree.slice(1).reduce((a, b) => 
      converge(a).sub(converge(b))
    );
  case "Power":
    return  Qty(`${converge(tree[1])}^${converge(tree[2])}`)
  case "UNIT":
    return Qty(tree[1])
  default:
    return '';
  }
}

export let inProgress = (jstr) => {
  return jstr == '' ||
    jstr.includes("Error") || 
    jstr.includes("missing") || 
    jstr.includes("Sequence") ||
    jstr.includes("Nothing");
}


export const eqKey = Symbol();
export const precKey = Symbol();
// export default eqKey;