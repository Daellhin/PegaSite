<script lang="ts">
  import SearchInput from "$components/formHelpers/inputs/SearchInput.svelte";
  import { faSearch } from "@fortawesome/free-solid-svg-icons";

  export let label: string;
  export let required = false;
  export let value: string;
  export let size: "md" | "sm" | "xs" = "sm";
  export let placeholder = "Zoek";
  export let disabled = false;

  export let onInput: () => void = () => {};
  export let icon = faSearch;
  let classList = "";
  export { classList as class };

  $: inputId = label?.replace(/[ :]/g, "").toLowerCase();
</script>

<div
  class="form-control w-full"
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <label class="label" for={inputId}>
    <span class="label-text">
      {label}
      {#if required}
        <span class="text-red-500 font-bold">*</span>
      {/if}
    </span>
  </label>
  <SearchInput
    bind:value
    {placeholder}
    {disabled}
    {icon}
    {size}
    class={classList}
    {onInput}
  />
</div>
