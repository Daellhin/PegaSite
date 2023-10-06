<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let label: string
  export let value: string
  export let required = false
  export let disabled = false
  export let size: "md" | "sm" | "xs" = "sm"

  export let placeholder = ""
  export let labelClass = ""
  export let validator: (value: string) => string | undefined = () => ""
  export let onInput: () => void = () => {}
  export let iconLeft: IconDefinition | undefined = undefined
  export let iconRight: IconDefinition | undefined = undefined

  let edited = false

  $: inputId = label?.replace(/[ :]/g, "").toLowerCase()
  $: error = validator(value)
  $: showIconLeft = $$slots.iconLeft || iconLeft
  $: showIconRight = $$slots.iconRight || iconLeft
</script>

<div
  class="form-control w-full"
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <label class="label" for={inputId}>
    <span class={"label-text " + labelClass}>
      {label}
      {#if required}
        <span class="text-red-500 font-bold">*</span>
      {/if}
    </span>
  </label>
  <div class:relative={showIconLeft || showIconRight}>
    {#if showIconLeft}
      <div
        class="absolute inset-y-0 flex items-center pointer-events-none left-0 pl-3"
      >
        <slot name="iconLeft">
          <Fa icon={iconLeft} class="text-gray-500" />
        </slot>
      </div>
    {/if}
    <input
      {required}
      id={inputId}
      type="text"
      {placeholder}
      class="input input-bordered border-2 w-full"
      class:bg-base-300={disabled}
      class:text-slate-700={disabled}
      bind:value
      on:focusout={() => (edited = true)}
      on:input={onInput}
      {disabled}
      class:pl-9={showIconLeft}
      class:pr-9={showIconRight}
    />
    {#if showIconRight}
      <div
        class="absolute inset-y-0 flex items-center pointer-events-none right-0 pr-3"
      >
        <slot name="iconRight">
          <Fa icon={iconRight} class="text-gray-500" />
        </slot>
      </div>
    {/if}
  </div>
  {#if error && edited}
    <label class="label" for={inputId}>
      <span class={"label-text alt text-error " + labelClass}>
        {error}
      </span>
    </label>
  {/if}
</div>
