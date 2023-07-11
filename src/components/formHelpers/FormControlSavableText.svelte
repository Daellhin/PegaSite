<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import SavableTextInput from "./SavableTextInput.svelte";

  export let label: string;
  export let value: string;
  export let required = false;
  export let size: "sm" | "xs" = "sm";
  export let labelClass = "";

  export let placeholder: string;
  export let save: () => Promise<void>;
  export let validate: (value: string) => string | undefined = () => undefined;

  const id = uuidv4();
</script>

<div
  class="form-control w-full"
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <label class="label" for={id}>
    <span class={`label-text ${labelClass}`}>
      {label}
      {#if required}
        <span class="text-red-500 font-bold">*</span>
      {/if}
    </span>
  </label>
  <SavableTextInput bind:value {placeholder} {save} {id} {validate} />
</div>
