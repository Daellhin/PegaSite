<script lang="ts">
  import { MultiSelect } from "svelte-multiselect"

  export let label: string
  export let values: string[]
  export let required = false
  export let disabled = false
  export let size: "full" | "md" | "sm" | "xs" = "sm"

  export let placeholder = "Kies"
  export let options = Array<string>()
  export let allowUserOptions = false
</script>

<div
  class="form-control w-full"
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <label class="label" for="multiselect">
    <span class="label-text">
      {label}
      {#if required}
        <span class="text-red-500 font-bold">*</span>
      {/if}
    </span>
  </label>
  <MultiSelect
    bind:selected={values}
    {options}
    {allowUserOptions}
    {placeholder}
    {disabled}
  />
</div>

<style lang="postcss">
  @import "../../css/multiselect.postcss";
</style>
