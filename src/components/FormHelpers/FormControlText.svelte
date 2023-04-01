<script lang="ts">
    export let label: string;
    export let placeholder: string;
    export let textValue: string;
    export let required = false;

    $: inputId = label?.replace(/ /g, '')
</script>

<div class="form-control w-full max-w-xs">
  <label class="label" for={inputId}>
    <span class="label-text"
    >{label}
    {#if required}
        <span class="text-red-500 font-bold">*</span>
    {/if}
</span>
  </label>
  <input
    required
    id={inputId}
    type="text"
    placeholder={placeholder}
    class="input input-bordered w-full max-w-xs"
    bind:value={textValue}
  />
</div>
