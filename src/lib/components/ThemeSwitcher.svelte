<script>
  import settings from '../js/settings'
  import Button from './Button.svelte'
  import Row from './Row.svelte'
  export let theme = 'light'

  let icon
  let iconMap = {
    system : 'computer',
    light : 'light_mode',
    dark : 'dark_mode'
  }
  settings.subscribe(val => { icon = iconMap[val.theme] })
</script>

<Button
  outlined={true}
  class='themeSwitcher {$$props.class}'
  onClick={() => theme = (theme == 'dark') ? 'light' : 'dark'}
>
  <Row>
    <span class='material-symbols-rounded icon'>
      {icon}
    </span>
    <span class='label hide-under-900'>{theme} theme</span>
  </Row>
</Button>

<style>
span.label {
  text-transform: capitalize;
  margin-left: 0.25rem;
}

@media only screen and (min-width: 800px) {
  span.label {
    min-width: 12ch;
  }
}
</style>
