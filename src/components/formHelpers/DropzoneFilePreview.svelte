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
  export let dragFullyDisabled: boolean
</script>

<div
  class="flex items-center w-full pl-2 pr-3 py-2 text-sm max-w-sm gap-2"
  class:border-b-2={!isLast}
>
  {#if !dragFullyDisabled}
    <DndHandle bind:dragDisabled />
  {/if}
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
  <button
    class="btn btn-circle btn-xs hover:text-red-500 ml-auto"
    type="button"
    on:click={() => remove(image)}
  >
    <Fa icon={faXmark} />
  </button>
</div>

<style lang="postcss">
  :global(#dnd-action-dragged-el) {
    @apply border-2 rounded-lg bg-base-100 !important;
  }
</style>
