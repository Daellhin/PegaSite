<script lang="ts">
  export let label: string;
  export let value: string;
  export let required = false;
  export let size: "md" |"sm" | "xs" = "sm";

  export let placeholder = "";
  export let disabled = false;
  export let labelClass = "";
  export let validator: (value: string) => string | undefined = () => "";
  export let onInput: () => void = () => {};

  let edited = false;

  $: inputId = label?.replace(/[ :]/g, "").toLowerCase();
  $: error = validator(value);
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
  />
  {#if error && edited}
    <label class="label" for={inputId}>
      <span class={`label-text alt text-error ${labelClass}`}>
        {error}
      </span>
    </label>
  {/if}
</div>
