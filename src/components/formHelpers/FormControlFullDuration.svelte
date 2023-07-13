<script lang="ts">
  export let label: string;
  export let value: string;
  export let required = false;
  export let size: "sm" | "xs" = "sm";

  export let labelClass = "";
  export let disabled = false;

  let valueStart = value.split("-")[0];
  let valueEnd = value.split("-")[1];
  let fullDay = false;

  $: updateValue(valueStart, valueEnd, fullDay);
  function updateValue(valueStart: string, valueEnd: string, fullDay: boolean) {
    if (fullDay) {
      value = "Volledige dag";
    } else {
      value = `${valueStart}-${valueEnd}`;
    }
  }

  $: inputIdStart = label?.replace(/[ :]/g, "-").toLowerCase() + "start";
  $: inputIdEnd = label?.replace(/[ :]/g, "-").toLowerCase() + "end";
  $: inputIdFullDay = label?.replace(/[ :]/g, "-").toLowerCase() + "fullday";
</script>

<div
  class="form control w-full"
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
  <div class="mt-2 flex items-center gap-3 text-sm">
    <input
      id={inputIdFullDay}
      bind:checked={fullDay}
      type="checkbox"
      class={"border-fix  bg-clip-padding w-6 h-6 bg- hover:cursor-pointer rounded-md  checked:bg-primary " +
        (disabled ? "border-0 bg-base-200" : "border-2 bg-transparent")}
      {disabled}
    />
    <label for={inputIdFullDay} class:opacity-50={disabled}>Volledige dag</label
    >
  </div>
</div>

<style>
  .border-fix {
    --tw-border-opacity: 0.2 !important;
    border-color: hsl(var(--bc) / var(--tw-border-opacity)) !important;
  }
</style>
