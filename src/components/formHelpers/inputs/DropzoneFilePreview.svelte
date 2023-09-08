<script lang="ts">
  import DndHandle from "$components/DNDHandle.svelte"
  import { PreviewableFile } from "$lib/utils/PreviewableFile"
  import {
      faFileCircleExclamation,
      faXmark,
  } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let isLast = false
  export let image: string | File | PreviewableFile
  export let remove: (toRemove: File | string) => void
  export let dragDisabled: boolean
</script>

<div
  class="inline-flex items-center w-full pl-2 pr-4 py-2 text-sm border-color max-w-sm"
  class:border-b-2={!isLast}
>
  <div class="flex flex-row gap-2">
    <DndHandle bind:dragDisabled />
    {#if image instanceof File}
      <div class="w-10 rounded-sm h-6 overflow-hidden">
        {#await PreviewableFile.getFilePreview(image)}
          <div class="bg-base-200 w-full h-full" />
        {:then src}
          <img class="" alt={image.name} {src} />
        {:catch error}
          <div
            class="tooltip tooltip-right"
            data-tip="Bestand kan niet getoond worden"
          >
            <Fa icon={faFileCircleExclamation} />
            <div class="hidden">{error}</div>
          </div>
        {/await}
      </div>
      <div class="my-auto font-semibold">{image.name}</div>
    {:else}
      <img class="w-10 rounded-sm" alt="Upload" src={image} />
      <div class="my-auto font-semibold">Geüpload bestand</div>
    {/if}
  </div>
  <button
    class="btn btn-circle btn-xs hover:text-red-500 ml-auto"
    type="button"
    on:click={() => remove(image)}
  >
    <Fa icon={faXmark} />
  </button>
</div>

<style lang="postcss">
  .border-color {
    border-color: hsl(var(--bc) / var(--tw-border-opacity));
  }
</style>
