<script>
import Logo from './Logo.svelte'
</script>

<div class="footer w-full flex items-center py-2 px-4 justify-between mt-auto">
  <h2 class="text-xl">UnitPlayground</h2>

  <p class="hidden md:block text-base">Copyright © 2023, Ac Hybl.</p>

  <!-- logo -->
  <a class="logo p-4" href="/">
    <Logo class="w-6 md:w-8" />
  </a>
</div>

<style lang="postcss">
div.footer {
  bottom: 0;
  background-color: var(--nav);
  color: var(--nav-text);
  font-size: 1.2rem;
  border-top: var(--nav-border-bottom-width) var(--nav-border) solid;
}
</style>
