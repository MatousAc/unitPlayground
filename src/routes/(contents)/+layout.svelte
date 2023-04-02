<script>
import '$/app.postcss'
import '$css/colors.css'
import Footer from '$comp/Footer.svelte'
import Bar from '$comp/Bar.svelte'
</script>

<main class="skeleton light flex flex-col">
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
