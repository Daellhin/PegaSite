<script lang="ts">
    export let label: string
    export let value: string
    export let required = false
    export let size: "sm" | "xs" = "sm"
    
    export let labelClass = ""
    export let placeholder: string
    export let passEdited  = false
  
    $: inputId = label?.replace(/[ :]/g, "").toLowerCase()
  </script>
  
  <div
    class="form-control w-full"
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
    <input
      on:focusout={() => (passEdited = true)}
      {required}
      id={inputId}
      type="password"
      {placeholder}
      class="input input-bordered border-2 w-full"
      bind:value
    />
  </div>
  