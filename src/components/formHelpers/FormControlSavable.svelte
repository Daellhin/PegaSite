<script lang="ts">
  import SavableInput from "$components/formHelpers/inputs/SavableInput.svelte"
  import InfoCircle from "$components/icons/Flowbite/InfoCircle.svelte"
  import { v4 as uuidv4 } from "uuid"

  export let label: string
  export let value: any
  export let required = false
  export let size: "sm" | "xs" = "sm"
  export let labelClass = ""
  export let disabled = false

  export let type: "text" | "email" | "number" | "password"
  export let placeholder: string
  export let save: () => Promise<void>
  export let validate: (value: string) => string | undefined = () => undefined
  export let tooltip = ""

  const id = uuidv4()
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
      <div
        class="tooltip ml-auto tooltip-left sm:tooltip-bottom"
        data-tip={tooltip}
      >
        <button class="btn btn-ghost btn-xs btn-circle">
          <InfoCircle class="" />
        </button>
      </div>
    {/if}
  </div>
  <SavableInput
    {id}
    {type}
    bind:value
    {placeholder}
    {save}
    {validate}
    {disabled}
  />
</div>
