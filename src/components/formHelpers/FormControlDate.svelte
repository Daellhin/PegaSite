<script lang="ts">
  import dayjs, { Dayjs } from "dayjs"

  export let label: string
  export let value: Dayjs
  export let required = false
  export let disabled = false
  export let size: "full"| "md" | "sm" | "xs" = "sm"

  let dateInternal = value?.format("YYYY-MM-DD")
  $: value = dayjs(dateInternal)

  $: inputId = label?.replace(/[ :]/g, "").toLowerCase()
</script>

<div
  class="form-control w-full"
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <label class="label" for={inputId}>
    <span class="label-text">
      {label}
      {#if required}
        <span class="text-red-500 font-bold">*</span>
      {/if}
    </span>
  </label>
  <input
    id={inputId}
    type="date"
    bind:value={dateInternal}
    {required}
    {disabled}
    class="input input-bordered border-2 hover:cursor-text"
  />
</div>
