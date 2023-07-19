<script lang="ts">
  import MdInfoOutline from "svelte-icons/md/MdInfoOutline.svelte";
  import { v4 as uuidv4 } from "uuid";
  import SavableTextInput from "./inputs/SavableTextInput.svelte";

  export let label: string;
  export let value: string;
  export let required = false;
  export let size: "sm" | "xs" = "sm";
  export let labelClass = "";

  export let placeholder: string;
  export let save: () => Promise<void>;
  export let validate: (value: string) => string | undefined = () => undefined;
  export let tooltip = "";

  const id = uuidv4();
</script>

<div
  class="form-control w-full"
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <div class="flex items-center">
    <label class="label" for={id}>
      <span class={`label-text ${labelClass}`}>
        {label}
        {#if required}
          <span class="text-red-500 font-bold">*</span>
        {/if}
      </span>
    </label>
    {#if tooltip}
      <div class="tooltip ml-auto tooltip-left sm:tooltip-bottom" data-tip={tooltip}>
        <button class="btn btn-ghost btn-xs btn-circle">
          <div class="flex-shrink-0 w-4 h-4"><MdInfoOutline /></div>
        </button>
      </div>
    {/if}
  </div>
  <SavableTextInput bind:value {placeholder} {save} {id} {validate} />
</div>
