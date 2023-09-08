<script lang="ts">
  import Dropzone from "$components/formHelpers/inputs/Dropzone.svelte"

  export let label: string
  export let combinedImages: (string | File)[]
  export let accept = "image/*"
  export let required = false
  export let maxAmount = 100
  export let size: "md" | "sm" | "xs" = "sm"
</script>

<div
  class="form-control w-full"
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <label class="label" for="dropzone-file">
    <span class="label-text">
      {label}
      {#if required}
        <span class="text-red-500 font-bold">*</span>
      {/if}
    </span>
  </label>
  <Dropzone bind:combinedImages {accept} {required} {maxAmount}  />
</div>
