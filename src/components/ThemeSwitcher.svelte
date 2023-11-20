<script>
import { theme } from '$js/stores'

let selectedTheme = 'system'
theme.subscribe(t => (selectedTheme = t))
$: changeTheme = () => {
  if (selectedTheme === 'system') {
    $theme = 'light'
  } else if (selectedTheme === 'light') {
    $theme = 'dark'
  } else {
    $theme = 'system'
  }
}
let iconMap = {
  system: 'computer',
  light: 'light_mode',
  dark: 'dark_mode'
}
</script>

<button
  class="do-transition md:py-1 px-3 {$$props.class}"
  style={$$props.style}
  on:click={changeTheme}
>
  <span class="material-symbols-rounded icon">
    {iconMap[selectedTheme]}
  </span>
  <span class="hide-sm label ml-2 md:ml-4">{selectedTheme} theme</span>
</button>

<style>
button {
  border: solid 2px var(--nav-text);
  border-radius: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

span.label {
  text-transform: capitalize;
}
@media only screen and (min-width: 768px) {
  span.label {
    min-width: 12ch;
  }
}

/* responsive design */
@media only screen and (max-width: 767px) {
  .hide-sm {
    display: none;
  }
  button {
    border: none;
  }
}
</style>
