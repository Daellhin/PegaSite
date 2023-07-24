<script lang="ts">
  import InfoCircle from "$components/icons/Flowbite/InfoCircle.svelte"

  let classList = ""
  export { classList as class }
</script>

<div class={"alert border border-base-300 w-fit " + classList}>
  <InfoCircle class="text-xl text-info" />
  <span>
    <slot />
  </span>
</div>
