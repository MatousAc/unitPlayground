<script>
  export let justify='center'
  export let align='center'
</script>

<div class='row justify-content-{justify} align-items-{align}'>
	<slot></slot>
</div>

<style>
.row {
	display: flex;
	flex-direction: row;
	width: fit-content;
}
</style>