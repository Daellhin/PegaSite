<script lang="ts">
  import DndHandle from "$components/DNDHandle.svelte"
  import { PreviewableFile } from "$lib/utils/PreviewableFile"
  import { UploadProgress, toString } from "$lib/utils/UploadProgress"
  import {
    faCheck,
    faFileCircleExclamation,
    faXmark,
    type IconDefinition,
  } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let isLast = false
  export let image: string | File | IconDefinition
  export let imageName: string
  export let remove: () => void
  export let dragDisabled: boolean
  export let dragFullyDisabled: boolean
  export let saving = false
  export let progress: UploadProgress | undefined = undefined
  export let onPreviewFinishedLoading: () => void = () => {}

  async function loadPreview(image: File) {
    const preview = await PreviewableFile.getFilePreview(image)
    onPreviewFinishedLoading()
    return preview
  }
</script>

<div
  class="flex items-center w-full pl-2 pr-3 py-2 text-sm max-w-sm gap-2 input-bordered"
  class:border-b-2={!isLast}
>
  {#if !dragFullyDisabled}
    <DndHandle bind:dragDisabled />
  {/if}
  {#if image instanceof File}
    <div class="w-10 rounded-sm h-6 overflow-hidden">
      {#await loadPreview(image)}
        <div class="bg-base-200 w-full h-full" />
        loading
      {:then src}
        <img class="" alt={image.name} {src} />
        finished
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
  {:else if typeof image === "string"}
    <img class="w-10 rounded-sm" alt="Upload" src={image} />
  {:else}
    <Fa icon={image} />
  {/if}
  <div class="my-auto font-semibold">{imageName}</div>
  <div class="min-w-6 h-6 ml-auto">
    {#if !saving}
      <button
        class="btn btn-circle btn-xs hover:text-red-500"
        type="button"
        title="Verwijderen"
        on:click={remove}
      >
        <Fa icon={faXmark} />
      </button>
    {:else if progress !== undefined}
      <div class="flex items-center justify-center h-full w-full" title={toString(progress)}>
        {#if progress === UploadProgress.CONVERTING || progress === UploadProgress.UPLOADING}
          <span class="loading loading-ring loading-sm" />
        {:else if progress === UploadProgress.DONE}
          <Fa icon={faCheck} color="green" />
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  :global(#dnd-action-dragged-el) {
    @apply border-2 rounded-lg bg-base-100 !important;
  }
</style>
