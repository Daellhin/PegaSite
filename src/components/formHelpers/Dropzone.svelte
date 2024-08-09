<script lang="ts">
  import CloudIcon from "$components/icons/Flowbite/CloudIcon.svelte"
  import { FLIP_DURATION } from "$lib/utils/Constants"
  import { PreviewableFile } from "$lib/utils/PreviewableFile"
  import { getFilesFromDragEvent, ignoreDragOver } from "$lib/utils/Utils"
  import { dndzone } from "svelte-dnd-action"
  import DropzoneFilePreview from "./DropzoneFilePreview.svelte"

  export let label: string
  export let combinedImages: (string | File)[]
  export let required = false
  export let disabled = false
  export let size: "full" | "md" | "sm" | "xs" = "sm"

  export let accept = "image/*"
  export let maxAmount = 100
  export let sortable = true
  export let dropzoneId = "file-dropzone"

  $: remainingSpace = maxAmount - combinedImages.length

  // -- File input handlers --
  function onFileInput(e: Event & { currentTarget: HTMLInputElement }) {
    if (!e.currentTarget.files) return
    const newFiles = Array.from(e.currentTarget.files).filter((e) =>
      e.type.match(accept),
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

<div
  class="form-control w-full"
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <label class="label" for="dropzone-file">
    <span class="label-text">
      {label}
      {#if required}
        <span class="text-red-500 font-bold">*</span>
      {/if}
    </span>
  </label>
  <!-- Dropzone -->
  {#if remainingSpace}
    <label
      on:drop={onFileDrop}
      on:dragover={(e) => ignoreDragOver(e, disabled)}
      id={dropzoneId}
      class="relative cursor-pointer input-bordered border-2 custom-border-color border-dashed rounded-lg bg-base-200"
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
        class="absolute top-0 h-full w-full opacity-0 -z-10"
        {accept}
        multiple
        required={required && combinedImages.length < 0}
        {disabled}
      />
    </label>
  {/if}

  <!-- SelectedImages viewer -->
  {#if combinedImages.length}
    <div
      class="flex flex-col input-bordered border-2 rounded-lg min-h-[3rem] bg-base-100 justify-center"
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
</div>

<style lang="postcss">
  @media (prefers-color-scheme: dark) {
    .custom-dark-hover:hover {
      background-color: #313741 !important;
    }
  }
</style>
