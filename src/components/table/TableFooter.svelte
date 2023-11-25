<script lang="ts">
  import ErrorLine from "$components/ErrorLine.svelte"

  export let filteredLength: number
  export let fullLength: number
  export let saving = false
  export let error = ""
</script>

<div>
  <div class="flex items-center justify-between mt-4">
    <div class="opacity-80 flex gap-1 items-center">
      Weergegeven
      <span class="font-bold opacity-100">{filteredLength}</span>
      van
      <span class="font-bold opacity-100">{fullLength}</span>
      {#if saving}
        <span class="loading loading-circle loading-xs ml-1" />
      {/if}
    </div>
  </div>
  {#if error}
    <ErrorLine {error} />
  {/if}
</div>
