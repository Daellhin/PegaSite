<script lang="ts">
  export let label: string;
  export let dateValue: Date;
  export let required = false;

  $: inputId = label?.replace(/[ :]/g, "").toLowerCase();
</script>

<div class="form-control w-full max-w-sm">
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
    class="input input-bordered border-2"
    type="date"
    bind:value={dateValue}
  />
</div>
