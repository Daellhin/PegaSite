<script lang="ts">
  import {
      faAnglesLeft,
      faAnglesRight,
  } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let filteredLength: number
  export let fullLength: number
  export let showControls = true
  export let saving = false
</script>

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

  {#if showControls}
    <div class="join">
      <button class="join-item btn btn-sm lin" type="button" disabled>
        <Fa icon={faAnglesLeft} class="" />
      </button>
      <button class="join-item btn btn-sm btn-active" type="button">1</button>
      <button class="join-item btn btn-sm" type="button" disabled>
        <Fa icon={faAnglesRight} class="" />
      </button>
    </div>
  {/if}
</div>
