<script lang="ts">
  import { faSearch } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";

  export let value: string;
  export let size: "md" | "sm" | "xs" = "sm";
  export let placeholder = "Zoek";
  export let disabled = false;
  export let onInput: () => void = () => {};

  export let icon = faSearch;
  let classList = "";
  export { classList as class };
</script>

<div
  class={"relative" + classList}
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <div class="absolute inset-y-0 left-0 flex items-center pl-3">
    <Fa icon={icon} class="text-gray-500" />
  </div>
  <input
    type="text"
    bind:value
    {placeholder}
    class="input input-bordered border-2 block w-full p-4 pl-9"
    {disabled}
    on:input={onInput}
  />
</div>
