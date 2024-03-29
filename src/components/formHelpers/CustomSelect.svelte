<script lang="ts">
  import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"
  import Select from "svelte-select"

  export let label: string
  export let value: any
  export let required = false
  export let disabled = false
  export let size: "full" | "md" | "sm" | "xs" = "sm"

  export let placeholder = "Kies"
  export let items = Array<{ label: string; value: any }>()
  export let groupBy: ((e: any) => any) | undefined = undefined
  export let searchable = false

  $: selectId = label?.replace(/[ :]/g, "").toLowerCase()

  // -- Value handling --
  let internalValue: { value: any; label?: any } | undefined = undefined
  $: updateInternal(value)
  $: updateExternal(internalValue)

  function updateInternal(_: any) {
    if (!value) {
      internalValue = undefined
    } else {
      if (value === internalValue?.value) return
      internalValue = { value: value, label: value.toString() }
    }
  }
  function updateExternal(_: any) {
    value = internalValue?.value
  }

  const floatingConfig = {
    placement: "bottom",
    middleware: [],
  }
</script>

<div
  class="form-control w-full daisyui-themed"
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <label class="label" for={selectId}>
    <span class="label-text"
      >{label}
      {#if required}
        <span class="text-red-500 font-bold">*</span>
      {/if}
    </span>
  </label>
  <Select
    {items}
    {groupBy}
    id={selectId}
    bind:value={internalValue}
    class={"select select-bordered border-2 font-normal " +
      (searchable ? "searchable" : "")}
    showChevron
    {placeholder}
    {floatingConfig}
    {required}
    {searchable}
    {disabled}
  >
    <div slot="chevron-icon">
      <Fa icon={faChevronDown} class="text-gray-500 text-sm" />
    </div>
  </Select>
</div>

<style lang="postcss">
  .daisyui-themed {
    --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
      0 1px 2px -1px var(--tw-shadow-color);

    /* Select */
    --background: oklch(var(--b1) / var(--tw-bg-opacity));
    --border: 1px oklch(var(--bc) / 0.2) solid;
    --border-hover: 1px oklch(var(--bc) / 0.2) solid;
    --list-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

    /* Dropdown */
    --list-background: oklch(var(--b1, var(--b1)) / 1);
    --list-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --list-max-height: 20rem;
    --list-height: auto;
    --list-z-index: 11;
    --list-border-radius: 0.5rem;
    --group-title-text-transform: capitalize;
    --group-item-padding-left: 35px;
    --item-hover-bg: oklch(var(--bc) / 0.1);
    --item-is-active-bg: oklch(var(--p) / 1);
    --item-is-active-color: oklch(var(--pc) / 1);
    --item-height: 2.5rem;
    --item-line-height: 2.5rem;
    @media (min-width: 640px) {
      --item-height: 1.75rem;
      --item-line-height: 1.75rem;
    }
  }
  :global {
    .select {
      line-height: 1.25rem;
    }
    .svelte-select.focused {
      outline: 2px solid oklcha(var(--bc) / 0.2) !important;
      outline-offset: 2px !important;
    }
    .svelte-select,
    .svelte-select input {
      cursor: pointer !important;
    }
    .list-item {
      font-size: 1rem !important;
    }
    .svelte-select-list {
      margin-top: 0.6rem;
    }
    .svelte-select.searchable,
    .svelte-select.searchable input {
      cursor: text !important;
    }
  }
</style>
