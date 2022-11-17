<script>
  import settings from '../js/settings'
  import Row from './Row.svelte';
  import Col from './Col.svelte';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class=settingsWrapper>
  <div class=settings on:click|stopPropagation={() => {}}>
    <Col>
      <label for=significantDigits>
        {$settings.significantDigits} decimal place{
        $settings.significantDigits == 1 ? '' : 's'}
      </label>
      <input
        name=significantDigits
        type=range
        bind:value={$settings.significantDigits}
        min=0
        max=10
      />
    </Col>
    <Row>
      <label for=includeScalar>
        Include scalar values:
      </label>
      <input name=includeScalar type=checkbox bind:checked={$settings.includeScalar} />
    </Row>
    
  </div>
</div>

<style>
  .settingsWrapper { 
    position: absolute;
    width: 100%;
  }
  .settings {
    position: relative;
    top: 0;
    left: 0;
    display: flex;
    padding: 1em;
    background-color: var(--textClr);
    color: var(--backClr);
    box-shadow: 0px 5px 8px 0 grey;
    /* visibility: hidden; */
  }

  .settings:hover {
    outline: 1px black;
  }
</style>
