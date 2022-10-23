<script>
  import { draggable } from '@neodrag/svelte';
</script>

<div class="fitContent" use:draggable={{
    bounds: 'parent',
    cancel: '.noDrag',
    defaultClass: 'draggable',
    defaultClassDragging: 'dragging',
    defaultClassDragged: 'dragged'
  }}>
  <slot/>
</div>
