<script lang="ts">
  export let label: string;
  export let selectValue: string;
  export let required = false;

  $: selectId = label?.replace(/[ :]/g, "").toLowerCase();

  function removePlaceholderStyle(event: Event) {
    (event?.target as HTMLElement).classList.remove("placeholder-style");
  }
</script>

<div class="form-control w-full max-w-xs">
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
    class="select select-bordered placeholder-style"
    bind:value={selectValue}
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
