<script lang="ts">
  export let label: string;
  export let value: boolean;
  export let id: string;
  export let disabled = false;
  let classList = "";
  export { classList as class };
</script>

<div class={"flex items-center gap-3 text-sm " + classList}>
  <input
    {id}
    bind:checked={value}
    type="checkbox"
    class={"border-fix  bg-clip-padding w-6 h-6 bg- hover:cursor-pointer rounded-md  checked:bg-primary " +
      (disabled ? "border-0 bg-base-200" : "border-2 bg-transparent")}
    {disabled}
  />
  <label for={id} class:opacity-50={disabled}>{label}</label>
</div>

<style>
  .border-fix {
    --tw-border-opacity: 0.2 !important;
    border-color: hsl(var(--bc) / var(--tw-border-opacity)) !important;
  }
</style>
