<script lang="ts">
  import Select from "svelte-select";

  export let label: string;
  export let selectValue: any;
  export let required = false;
  export let items = Array<any>();
  export let groupBy: (arg0: any) => any;

  const indicatorIcon = `<svg class="indicatorIcon" enable-background="new 0 0 29 14" height="14px" id="Layer_1" version="1.1" viewBox="0 0 29 14" width="29px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><polygon fill="currentColor" points="0.15,0 14.5,14.35 28.85,0 "/></svg>`;

  $: selectId = label?.replace(/ /g, "");

  function handleSelect(event: any) {
    selectValue = event.detail;
  }
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
    showIndicator={true}
    indicatorSvg={indicatorIcon}
    id={selectId}
    on:select={handleSelect}
  />
</div>

<style lang="postcss">
  .daisyui-themed {
    --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
      0 1px 2px -1px var(--tw-shadow-color);

    /* Select */
    --height: 2rem;
    --indicatorRight: 0.3rem;
    --background: transparent;
    --border: 1px hsl(var(--bc) / 0.2) solid;
    --borderRadius: var(--rounded-btn, 0.5rem);
    --borderFocusColor: hsla(var(--bc) / 0.2);
    --listShadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

    /* Dropdown */
    --listBackground: hsl(var(--b2, var(--b1)) / 1);
    --itemHoverBG: hsl(var(--bc) / 0.1);
    --itemIsActiveBG: hsl(var(--p) / 1);
    --itemIsActiveColor: hsl(var(--pc) / 1);
  }
  :global {
    .listContainer {
      z-index: 11 !important;
    }
    .indicatorIcon {
      width: 0.54rem;
      color: #9ca3af !important;
    }
    .selectContainer.focused {
      outline: 2px solid hsla(var(--bc) / 0.2) !important;
      outline-offset: 2px !important;
    }
    .selectContainer {
      height: 3rem !important;
    }
    .selectContainer input,
    .form-control {
      cursor: text !important;
      .indicatorIcon {
        cursor: pointer !important;
      }
    }
    .listItem .item {
      font-size: 1em !important;
    }
  }
</style>
