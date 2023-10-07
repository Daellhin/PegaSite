<script lang="ts">
  import Dropzone from "$components/formHelpers/inputs/Dropzone.svelte"

  export let label: string
  export let values: (string | File)[]
  export let required = false
  export let disabled = false
  export let size: "full"| "md" | "sm" | "xs" = "sm"

  export let accept = "image/*"
  export let maxAmount = 100
  export let sortable = true
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
  <Dropzone
    bind:combinedImages={values}
    {accept}
    {required}
    {maxAmount}
    {disabled}
    {sortable}
  />
</div>
