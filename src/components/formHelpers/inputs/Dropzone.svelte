<!-- Component currently only supports previewing images -->
<script lang="ts">
  import CloudIcon from "$components/icons/Flowbite/CloudIcon.svelte"
  import { FLIP_DURATION } from "$lib/utils/Constants"
  import { PreviewableFile } from "$lib/utils/PreviewableFile"
  import { getFilesFromDragEvent, ignoreDragOver } from "$lib/utils/Utils"
  import { dndzone } from "svelte-dnd-action"
  import DropzoneFilePreview from "./DropzoneFilePreview.svelte"

  export let combinedImages: (string | File)[]
  export let disabled = false
  export let accept: string
  export let dropzoneId = "file-dropzone"
  export let maxAmount = 100
  export let required = false
  export let sortable = true

  $: remainingSpace = maxAmount - combinedImages.length

  // -- File input handlers --
  function onFileInput(e: Event & { currentTarget: HTMLInputElement }) {
    if (!e.currentTarget.files) return
    const newFiles = Array.from(e.currentTarget.files).filter((e) =>
      e.type.match(accept)
    )
    addFiles(newFiles)
  }
  function onFileDrop(event: DragEvent) {
    if (disabled) return
    const droppedFiles = getFilesFromDragEvent(event)
    if (!droppedFiles) return
    const newFiles = droppedFiles.filter((e) => e.type.match(accept))
    addFiles(newFiles)
  }

  // -- File management --
  function addFiles(newFiles: File[]) {
    const newPreviewableFiles = newFiles.map((e) => new PreviewableFile(e))
    combinedImages = [
      ...combinedImages,
      ...newPreviewableFiles.slice(0, remainingSpace),
    ]
  }
  function remove(toRemove: File | string) {
    combinedImages = combinedImages.filter((e) => e != toRemove)
  }

  // -- Drag and drop --
  let dragDisabled = true

  $: dragableImages = combinedImages.map((e) => ({ id: e, data: e }))

  function handleConsider(event: CustomEvent<DndEvent<any>>) {
    dragableImages = event.detail.items
    dragDisabled = true
  }
  async function handleFinalize(event: CustomEvent<DndEvent<any>>) {
    dragableImages = event.detail.items
    dragDisabled = true
    combinedImages = dragableImages.map((e) => e.data)
  }
</script>

<!-- Dropzone -->
{#if remainingSpace}
  <label
    on:drop={onFileDrop}
    on:dragover={(e) => ignoreDragOver(e, disabled)}
    id={dropzoneId}
    class="cursor-pointer input-bordered border-2 custom-border-color border-dashed rounded-lg bg-base-200"
    class:cursor-not-allowed={disabled}
    class:hover:bg-base-300={!disabled}
    class:custom-dark-hover={!disabled}
  >
    <div class="flex flex-col items-center pt-5 pb-6">
      <CloudIcon class="text-gray-700 dark:text-gray-400 text-3xl" />
      <p class="mb-2 text-sm font-semibold">
        Sleep hier of klik om afbeelding<span class:hidden={maxAmount <= 1}
          >(en)</span
        > up te loaden
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG, GIF of WEBP
      </p>
    </div>
    <input
      id={dropzoneId}
      type="file"
      on:input={onFileInput}
      class="hidden"
      {accept}
      multiple
      {required}
      {disabled}
    />
  </label>
{/if}

<!-- SelectedImages viewer -->
{#if combinedImages.length}
  <div
    class="border-2 border-color rounded-lg input-bordered min-h-[3rem] bg-base-100"
    class:mt-2={remainingSpace}
    use:dndzone={{
      items: dragableImages,
      dragDisabled: dragDisabled,
      flipDurationMs: FLIP_DURATION,
      dropTargetStyle: {},
    }}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
  >
    {#each dragableImages as image, i (image)}
      <DropzoneFilePreview
        image={image.data}
        {remove}
        bind:dragDisabled
        dragFullyDisabled={!sortable}
        isLast={i == combinedImages.length - 1}
      />
    {/each}
  </div>
{/if}

<style lang="postcss">
  .custom-border-color {
    border-color: hsl(var(--bc) / var(--tw-border-opacity));
  }
  @media (prefers-color-scheme: dark) {
    .custom-dark-hover:hover {
      background-color: #313741 !important;
    }
  }
</style>
