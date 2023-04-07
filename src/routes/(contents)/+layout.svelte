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
  <div class="content width-full px-2 mx-auto md:py-8 md:px-10">
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

.content {
  max-width: 1300px;
  width: 90vw;
}
</style>
