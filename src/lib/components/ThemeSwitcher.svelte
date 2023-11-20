<script>
import settings, { updateSettings } from '$pj/settings'
import Button from '$pc/Button.svelte'
import Row from '$pc/Row.svelte'

let iconMap = {
  system: 'computer',
  light: 'light_mode',
  dark: 'dark_mode'
}
</script>

<Button
  outlined={true}
  class="themeSwitcher {$$props.class}"
  onClick={() => {
    updateSettings({ theme: $settings.theme == 'dark' ? 'light' : 'dark' })
  }}
>
  <Row>
    <span class="material-symbols-rounded icon">
      {iconMap[$settings.theme]}
    </span>
    <span class="label hide-sm">{$settings.theme} theme</span>
  </Row>
</Button>

<style>
span.label {
  text-transform: capitalize;
  margin-left: 0.25rem;
}
@media only screen and (min-width: 768px) {
  span.label {
    min-width: 12ch;
  }
}

/* responsive design */
@container playground (max-width: 767px) {
  .hide-sm {
    display: none;
  }
}
</style>
