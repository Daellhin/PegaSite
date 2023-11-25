<script lang="ts">
  import InfoCircle from "$components/icons/Flowbite/InfoCircle.svelte"

  let classList = ""
  export { classList as class }
</script>

<div class={"alert border-2 border-color w-fit" + classList}>
  <InfoCircle class="text-xl text-info" />
  <span>
    <slot />
  </span>
</div>

<style lang="postcss">
  .border-color {
    border-color: hsl(var(--bc) / var(--tw-border-opacity));
	--tw-border-opacity: 0.16;
  }
</style>
