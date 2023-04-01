## 0.2.0 (2023-03-1)  
### New Functionality
You can now take equations apart to rearrange their pieces!

To remove a piece of an equation, simply double-click on that piece and it will "eject". Drop an "equation fragment" on a placeholder to re-insert it into an equation. You can also drop in on an equation and it will be inserted in the closest position.

Demos of how to use UnitPlayground are coming soon.

## 0.1.4 (2023-03-21)
### First Log
This constitutes the first unofficial pre-release. The baseline instructions on using the package are extremely simple. As per the `readme.md`:

### Install
Currently, this package is only available in Svelte projects. Simply install with npm.
```
npm i unitplayground
```
### Add to your project
To use the component in your project import it and place it within some container `<div>`. UnitPlayground will fill its parent container. Example:

<h5 a><strong><code>+page.svelte</code></strong></h5>

```svelte
<script>
  import UnitPlayground from 'unitplayground'
</script>

<div class=base>
  <UnitPlayground/>
</div>

<style>
  .base {
    max-width: 100%;
    width: 90vw;
    height: 50vh;
  }
</style>
```
