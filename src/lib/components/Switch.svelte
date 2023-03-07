<!-- adapted from https://codepen.io/AllThingsSmitty/pen/MmxxOz/ -->
<script>
  export let checked
  export let name
</script>

<div class='container ml-3px'>
  <label class=switch for={name}>
    <input type=checkbox id={name} bind:checked={checked}/>
    <div class='slider round'></div>
  </label>
</div>

<style>
.container {
  height: 26px;
}

.switch {
  display: inline-block;
  height: 26px;
  position: relative;
  width: 46px;
}

.switch input {
  display:none;
}

.slider {
  background-color: #ccc;
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: .4s;
}

.slider:before {
  background-color: #fff;
  bottom: 4px;
  content: '';
  height: 18px;
  left: 4px;
  position: absolute;
  transition: .4s;
  width: 18px;
}

input:checked + .slider {
  background-color: #66bb6a;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius:28px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>