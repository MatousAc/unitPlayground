<script>
  import engine from "../js/computeEngine"

  export let inVal;
  export let outVal;
  console.log("inVal: ", inVal);
  $: mathJSON = JSON.stringify(engine.parse(inVal).json);
  console.log(mathJSON);
  let resultUnits = '';
</script>

<math-field 
	readonly>
	{resultUnits}
</math-field>

<style>
	math-field {
		outline: none;
	}
</style>