<script lang="ts">
  import IoIosArrowDown from "svelte-icons/io/IoIosArrowDown.svelte";
  import Select from "svelte-select";

  export let label: string;
  export let selectValue: any;
  export let required = false;
  export let items = Array<any>();
  export let groupBy: (arg0: any) => any;

  $: selectId = label?.replace(/ /g, "");

  function handleSelect(event: any) {
    selectValue = event.detail;
  }
  let floatingConfig = {
    placement: "bottom",
    middleware: [],
  };
</script>

<div class="form-control w-full max-w-xs daisyui-themed">
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
    on:select={handleSelect}
    class={"select select-bordered"}
    showChevron
    placeholder={"Kies"}
    {floatingConfig}
  >
    <div class="w-4 h-4 text-gray-500" slot="chevron-icon">
      <IoIosArrowDown />
    </div>
  </Select>
</div>

<style lang="postcss">
  .daisyui-themed {
    --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
      0 1px 2px -1px var(--tw-shadow-color);

    /* Select */
    --background: hsl(var(--b1) / var(--tw-bg-opacity));
    --border: 1px hsl(var(--bc) / 0.2) solid;
    --border-hover: 1px hsl(var(--bc) / 0.2) solid;
    --list-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    --font-size: 0.9rem;

    /* Dropdown */
    --list-background: hsl(var(--b1, var(--b1)) / 1);
    --list-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --list-max-height: 20rem;
    --list-z-index: 11;
    --list-border-radius: 0.5rem;
    --group-title-text-transform: capitalize;
    --group-item-padding-left: 35px;
    --item-hover-bg: hsl(var(--bc) / 0.1);
    --item-is-active-bg: hsl(var(--p) / 1);
    --item-is-active-color: hsl(var(--pc) / 1);
    --item-height: 2.5rem;
    --item-line-height: 2.5rem;
    @media (min-width: 640px) {
      --item-height: 1.75rem;
      --item-line-height: 1.75rem;
    }
  }
  :global {
    .svelte-select.focused {
      outline: 2px solid hsla(var(--bc) / 0.2) !important;
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
  }
</style>
