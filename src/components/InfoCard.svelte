<script lang="ts">
  import InfoCircle from "$components/icons/Flowbite/InfoCircle.svelte"

  let classList = ""
  export { classList as class }
</script>

<div class={"alert input-bordered border-2 border-color w-fit" + classList}>
  <InfoCircle class="text-xl text-info" />
  <span>
    <slot />
  </span>
</div>
