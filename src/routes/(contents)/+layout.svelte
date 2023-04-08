<script>
import '$/app.postcss'
import '$css/colors.css'
import Footer from '$comp/Footer.svelte'
import Bar from '$comp/Bar.svelte'
import { theme } from '$js/stores'
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />
</svelte:head>

<main class="skeleton {$theme} flex flex-col">
  <Bar />
  <div class="w-full md:w-4/5 text-xl mx-auto md:px-8 my-10 md:my-20 max-w-7xl">
    <slot />
  </div>
  <Footer />
</main>

<style>
.skeleton {
  color-scheme: light dark;
  background-color: var(--background);
  color: var(--text);

  min-height: 100vh;
}

:global(.skeleton > div a:not(.noColor)) {
  color: var(--accent);
}
</style>
