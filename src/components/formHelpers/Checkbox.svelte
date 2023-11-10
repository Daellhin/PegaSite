<script lang="ts">
  import { v4 as uuidv4 } from "uuid"

  export let label = ""
  export let value: boolean
  export let required = false
  export let disabled = false
  export let size: "full" | "md" | "sm" | "xs" = "sm"

  let classList = ""
  export { classList as class }
  export let id = uuidv4()
  export let labelClass = ""
</script>

<div
  class={"form-control w-full flex-row items-center gap-3 text-sm " + classList}
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <input
    {id}
    type="checkbox"
    bind:checked={value}
    {required}
    {disabled}
    class={"checkbox checkbox-xs checkbox-primary border-fix  bg-clip-padding  bg- hover:cursor-pointer rounded-md  checked:bg-primary " +
      (disabled ? "border-0 bg-base-200" : "border-2 bg-transparent")}
	    class:checkbox-md={size === "md"}
		class:checkbox-sm={size === "sm"}
		class:checkbox-xs={size === "xs"}
  />
  {#if label}
    <label for={id} class="label p-0" class:opacity-50={disabled}>
      <span class={"label-text " + labelClass}>
        {label}
        {#if required}
          <span class="text-red-500 font-bold">*</span>
        {/if}
      </span>
    </label>
  {/if}
</div>

<style>
  .border-fix {
    --tw-border-opacity: 0.2 !important;
    border-color: hsl(var(--bc) / var(--tw-border-opacity)) !important;
  }
</style>
