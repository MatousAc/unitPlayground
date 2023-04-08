<script>
export let reverse = false
</script>

<div class="textMedia lg:flex justify-space-between my-20">
  {#if !reverse}
    <div class="m-5 lg:w-2/5 lg:mr-12 lg:mt-5">
      <slot name="text" />
    </div>
    <div class="lg:max-w-2xl">
      <slot name="media" />
    </div>
  {:else}
    <div class="lg:max-w-2xl">
      <slot name="media" />
    </div>
    <div class="m-5 lg:w-2/5 lg:ml-12 lg:mt-5">
      <slot name="text" />
    </div>
  {/if}
</div>
