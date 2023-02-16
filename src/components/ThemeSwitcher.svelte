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
  class='themeSwitcher {$$props.class}'
  onClick={() => theme = (theme == 'dark') ? 'light' : 'dark'}
>
  <Row>
    <span class='material-symbols-rounded icon'>
      {icon}
    </span>
    <span class='label'>{theme}</span>
  </Row>
</Button>

<style>
span.label {
  text-transform: capitalize;
  margin-left: 0.25rem;
}

@media only screen and (max-width: 767px) {
  span.label {
    min-width: 6ch;
  }
}

@media only screen and (min-width: 768px) {
  span.label {
    min-width: 12ch;
  }

  span.label::after {
    content: ' theme';
  }
}
</style>
