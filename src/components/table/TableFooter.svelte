<script lang="ts">
  import {
    faAnglesLeft,
    faAnglesRight,
  } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let filteredLength: number
  export let fullLength: number
  export let showControls = true
</script>

<div class="flex items-center justify-between mt-4">
  <div class="opacity-80">
    Weergegeven
    <span class="font-bold opacity-100">{filteredLength}</span>
    van
    <span class="font-bold opacity-100">{fullLength}</span>
  </div>
  {#if showControls}
    <div class="join">
      <button class="join-item btn btn-sm lin" type="button">
        <Fa icon={faAnglesLeft} class="" />
      </button>
      <button class="join-item btn btn-sm btn-active" type="button">1</button>
      <button class="join-item btn btn-sm" type="button">
        <Fa icon={faAnglesRight} class="" />
      </button>
    </div>
  {/if}
</div>
