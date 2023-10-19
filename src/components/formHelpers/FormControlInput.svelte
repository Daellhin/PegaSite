<script lang="ts">
  import { validateEmail } from "$lib/utils/Validators"
  import {
    faEye,
    faEyeSlash,
    type IconDefinition,
  } from "@fortawesome/free-solid-svg-icons"
  import dayjs from "dayjs"
  import Fa from "svelte-fa"

  export let label: string
  export let value: any
  export let required = false
  export let disabled = false
  export let size: "full" | "md" | "sm" | "xs" = "sm"

  export let type: "text" | "email" | "date" | "password"
  export let placeholder = ""
  export let labelClass = ""
  export let edited = false
  export let validate: (value: string) => string | undefined = () => ""
  export let onInput: () => void = () => {}
  export let iconLeft: IconDefinition | undefined = undefined
  export let iconRight: IconDefinition | undefined = undefined
  export let toggleText = type === "password"
  export let toggled = false

  $: inputId = label?.replace(/[ :]/g, "").toLowerCase()
  $: error = validate(value)
  $: showIconLeft = $$slots.iconLeft || iconLeft
  $: showIconRight = $$slots.iconRight || iconRight || toggleText

  // -- Value handling --
  let internalValue = initValue(value)
  $: value = formatValue(internalValue)

  function initValue(value: any) {
    if (type === "date") return value?.format("YYYY-MM-DD")
    return value
  }
  function formatValue(value: any) {
    if (type === "date") return dayjs(internalValue)
    return value
  }

  // -- Type handling --
  function typeAction(node: HTMLInputElement) {
    // Replace email type with text type, because browser email validation is kinda crappy
    if (type === "email") {
      const oldValidate = validate
      validate = (value) => validateEmail(value) || oldValidate(value)
      node.type = "text"
    } else {
      node.type = type
    }
  }

  // -- Toggle text --
  let input: HTMLInputElement

  $: if (input?.type) input.type = toggled ? "text" : type
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
  <div class="relative">
    {#if showIconLeft}
      <div
        class="flex items-center absolute inset-y-0 left-0 pl-3 pointer-events-none"
      >
        <slot name="iconLeft">
          <Fa icon={iconLeft} class="text-gray-500" />
        </slot>
      </div>
    {/if}
    <input
      id={inputId}
      use:typeAction
      bind:this={input}
      bind:value={internalValue}
      {placeholder}
      {required}
      {disabled}
      on:focusout={() => (edited = true)}
      on:input={onInput}
      class="input input-bordered border-2 w-full hover:cursor-text"
      class:bg-base-300={disabled}
      class:text-slate-700={disabled}
      class:pl-9={showIconLeft}
      class:pr-9={showIconRight}
    />
    {#if showIconRight}
      <div class="flex items-center absolute inset-y-0 right-0 pr-3">
        <slot name="iconRight">
          {#if type !== "password"}
            <Fa icon={iconRight} class="text-gray-500" />
          {:else}
            <button
              type="button"
              on:click={() => (toggled = !toggled)}
              tabindex="-1"
            >
              <Fa
                icon={toggled ? faEyeSlash : faEye}
                class="text-gray-500 w-5"
              />
            </button>
          {/if}
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
