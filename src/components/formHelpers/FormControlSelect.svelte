<script lang="ts">
  export let label: string
  export let value: string
  export let required = false
  export let disabled = false
  export let size: "full" | "md" | "sm" | "xs" = "sm"

  $: selectId = label?.replace(/[ :]/g, "").toLowerCase()

  function removePlaceholderStyle(event: Event) {
    ;(event?.target as HTMLElement).classList.remove("placeholder-style")
  }
</script>

<div
  class="form-control w-full"
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
  <select
    id={selectId}
    {disabled}
    class="select select-bordered placeholder-style"
    bind:value
    on:change={removePlaceholderStyle}
    {required}
  >
    <option disabled selected>Kies</option>
    <slot />
  </select>
</div>

<style>
  :global(.select) {
    font-weight: inherit;
  }
  select.placeholder-style {
    color: #9ca3af;
  }
  :global(option:not([disabled])) {
    color: initial;
  }
</style>
