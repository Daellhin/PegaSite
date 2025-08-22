<script lang="ts">
  import ErrorLine from "$components/ErrorLine.svelte"
  import {
      faAnglesLeft,
      faAnglesRight,
  } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let filteredLength: number
  export let fullLength: number
  export let saving = false
  export let error = ""
  export let pagination = false

  export let previous = () => {}
  export let next = () => {}
  export let hasPrevious = false
  export let hasNext = false

  let index = 0

  function previousWrapper() {
    previous()
    index++
  }
  function nextWrapper() {
    next()
    index++
  }
</script>

<div>
  <div class="flex items-center justify-between mt-4">
    <div class="opacity-80 flex gap-1 items-center">
      Weergegeven
      <span class="font-bold opacity-100">{filteredLength}</span>
      van
      <span class="font-bold opacity-100">{fullLength}</span>
      {#if saving}
        <span class="loading loading-circle loading-xs ml-1"></span>
      {/if}
    </div>
    {#if pagination}
      <div class="join">
        <button
          class="join-item btn btn-sm lin"
          type="button"
          disabled={!hasPrevious}
          on:click={previousWrapper}
        >
          <Fa icon={faAnglesLeft} class="" />
        </button>
        <button class="join-item btn btn-sm btn-active" type="button"
          >{index + 1}</button
        >
        <button
          class="join-item btn btn-sm"
          type="button"
          disabled={!hasNext}
          on:click={nextWrapper}
        >
          <Fa icon={faAnglesRight} class="" />
        </button>
      </div>
    {/if}
  </div>

  {#if error}
    <ErrorLine {error} />
  {/if}
</div>
