<script lang="ts">
  import { faEye } from "@fortawesome/free-regular-svg-icons"
  import { faEyeSlash } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let label: string
  export let value: string
  export let required = false
  export let disabled = false
  export let size: "full" | "md" | "sm" | "xs" = "sm"

  export let placeholder: string
  export let labelClass = ""
  export let edited = false
  export let visible = false

  let input: HTMLInputElement

  $: if (input?.type) input.type = visible ? "text" : "password"
  $: inputId = label?.replace(/[ :]/g, "").toLowerCase()
</script>

<div
  class="form-control w-full"
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <label class="label" for={inputId}>
    <span class={`label-text ${labelClass}`}>
      {label}
      {#if required}
        <span class="text-red-500 font-bold">*</span>
      {/if}
    </span>
  </label>
  <div class="relative">
    <input
      id={inputId}
      bind:this={input}
      type="password"
      bind:value
      {placeholder}
      {required}
      {disabled}
      on:focusout={() => (edited = true)}
      class="input input-bordered border-2 w-full block p-4 pr-9"
    />
    <button
      class="absolute inset-y-0 right-0 flex items-center pr-3"
      type="button"
      on:click={() => (visible = !visible)}
    >
      <Fa icon={visible ? faEyeSlash : faEye} class="text-gray-500 w-5" />
    </button>
  </div>
</div>
