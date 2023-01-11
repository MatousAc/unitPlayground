<script>
  import settings from '../js/settings'
  import Fa from 'svelte-fa'
  import { faMoon, faSun, faDisplay } from '@fortawesome/free-solid-svg-icons'

  export let theme = "system";
  let themeIcon;
  settings.subscribe(val => {
    theme = val.theme
    if (theme === "system") {
      themeIcon = faDisplay
    } else if (theme === "light") {
      themeIcon = faSun
    } else {
      themeIcon = faMoon
    }
  })
</script>

<button
  class="{$$props.class}"
  on:click={() => theme = (theme == "dark") ? "light" : "dark"}
>
  <Fa class="icon" icon={themeIcon}/>
  <span class="label">{theme}</span>
</button>

<style>
button {
  background-color: var(--text-Clr);
  border: 2px solid var(--backClr);
  color: var(--backClr);
  font-size: 0.9em;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

button span.label {
  text-transform: capitalize;
  margin-left: 0.25rem;
}

@media only screen and (max-width: 767px) {
  span {
    min-width: 6ch;
  }

  .icon {
    min-width: 2ch;
  }
}

@media only screen and (min-width: 768px) {
  span {
    min-width: 12ch;
  }

  span.label::after {
    content: " theme";
  }

  .icon {
    min-width: 2ch;
  }
}
</style>
