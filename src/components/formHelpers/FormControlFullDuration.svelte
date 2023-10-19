<script lang="ts">
  import FormControlInputCheckbox from "$components/formHelpers/FormControlInputCheckbox.svelte"

  export let label: string
  export let value: string
  export let required = false
  export let disabled = false
  export let size: "full" | "md" | "sm" | "xs" = "sm"

  export let labelClass = ""

  let valueStart = value.split("-")[0]
  let valueEnd = value.split("-")[1]
  let fullDay = value === "Volledige dag"

  $: updateValue(valueStart, valueEnd, fullDay)
  function updateValue(valueStart: string, valueEnd: string, fullDay: boolean) {
    if (fullDay) {
      value = "Volledige dag"
    } else {
      value = `${valueStart}-${valueEnd}`
    }
  }

  $: inputIdStart = label?.replace(/[ :]/g, "-").toLowerCase() + "start"
  $: inputIdEnd = label?.replace(/[ :]/g, "-").toLowerCase() + "end"
  $: inputIdFullDay = label?.replace(/[ :]/g, "-").toLowerCase() + "fullday"
</script>

<div
  class="form control w-full"
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <label class="label" for={inputIdStart}>
    <span class={`label-text ${labelClass}`}>
      {label}
      {#if required}
        <span class="text-red-500 font-bold">*</span>
      {/if}
    </span>
  </label>
  <div class="flex row items-center gap-4">
    <input
      id={inputIdStart}
      class="input input-bordered border-2 font-mono hover:cursor-text"
      type="time"
      bind:value={valueStart}
      {required}
      disabled={fullDay || disabled}
    />
    <label for={inputIdEnd} class:opacity-50={fullDay || disabled}>tot</label>
    <input
      id={inputIdEnd}
      class="input input-bordered border-2 font-mono hover:cursor-text"
      type="time"
      bind:value={valueEnd}
      {required}
      disabled={fullDay || disabled}
    />
  </div>
  <FormControlInputCheckbox
    id={inputIdFullDay}
    label="Volledige dag"
    bind:value={fullDay}
    {disabled}
    class="mt-2"
  />
</div>
