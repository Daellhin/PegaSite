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
  /* Integrate svelte-multiselect with Tailwind and dark mode */
  :global(.multiselect) {
    @apply input input-bordered border-2 h-fit min-h-[3rem] !important;
  }
  :global(.multiselect:focus-within) {
    /* Add gray outline */
    outline: 2px solid oklcha(var(--bc) / 0.2);
    outline-offset: 2px;
    /* Add blue outline */
    --tw-ring-inset: var(--tw-empty, /*/ /*/);
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: #1c64f2;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow);
    border-color: #1c64f2 !important;
  }
  :global(.multiselect .selected li) {
    @apply bg-base-200;
  }
  :global(.multiselect .selected .remove:is(:hover, :focus) path) {
    @apply fill-primary;
  }
  :global(.multiselect .remove-all:is(:hover, :focus) path) {
    @apply fill-primary;
  }
  :global(.multiselect .options) {
    @apply bg-base-100 p-2 !important;
  }
  :global(.multiselect .options li) {
    @apply px-4 py-2 rounded-lg !important;
  }
  :global(.multiselect .options li:hover) {
    background-color: oklch(var(--bc) / 0.1);
  }

  /* Light/Dark theme support */
  @media (prefers-color-scheme: light) {
    :global(.multiselect .options li:hover) {
      background-color: #f2f2f2;
    }
  }
  @media (prefers-color-scheme: dark) {
    :global(.multiselect .options li:hover) {
      background-color: #373d49;
    }
  }
</style>
