<script lang="ts">
  import CloudIcon from "$components/icons/Flowbite/CloudIcon.svelte"
  import { FLIP_DURATION } from "$lib/utils/Constants"
  import { PreviewableFile } from "$lib/utils/PreviewableFile"
  import type { UploadProgress } from "$lib/utils/UploadProgress"
  import { getFilesFromDragEvent, ignoreDragOver } from "$lib/utils/Utils"
  import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons"
  import byteSize from "byte-size"
  import { dndzone } from "svelte-dnd-action"
  import Fa from "svelte-fa"
  import DropzoneFilePreview from "./DropzoneFilePreview.svelte"

  export let label: string
  export let combinedImages: (string | File)[]
  export let required = false
  export let disabled = false
  export let size: "full" | "md" | "sm" | "xs" = "sm"

  export let accept = "image/*"
  export let maxAmount = 1000
  export let sortable = true
  export let dropzoneId = "file-dropzone"
  export let disablePreviews = false
  export let showDiskSize = false
  export let saving = false
  export let progress: UploadProgress[] | undefined = undefined

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
    amountOfFinishedPreviews = combinedImages.filter(
      (e) => typeof e === "string",
    ).length
  }
  function remove(index: number) {
    combinedImages.splice(index, 1)
    combinedImages = combinedImages
    amountOfFinishedPreviews = combinedImages.filter(
      (e) => typeof e === "string",
    ).length
  }
  function removeAll() {
    combinedImages = []
    amountOfFinishedPreviews = 0
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
  $: fileSize = combinedImages
    ?.map((e) => {
      if (e instanceof File) {
        return e.size
      }
      return 0
    })
    .reduce((prev, current) => prev + current, 0)

  // -- Previews --
  let amountOfFinishedPreviews = combinedImages.length

  function onPreviewFinishedLoading() {
    amountOfFinishedPreviews++
  }
</script>

<div
  class="form-control w-full"
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <div class="flex items-center">
    <label class="label" for="dropzone-file">
      <span class="label-text">
        {label}
        {#if required}
          <span class="text-red-500 font-bold">*</span>
        {/if}
      </span>
    </label>
    {#if maxAmount > 1 && combinedImages.length > 0}
      <button
        class="btn btn-primary btn-xs ml-auto items-center"
        type="button"
        on:click={removeAll}
      >
        <span class="-mr-0.5">Leegmaken</span>
        <Fa icon={faXmark} />
      </button>
    {/if}
  </div>
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
  {#if maxAmount > 1 && combinedImages.length > 0}
    <div class="opacity-60 mt-1">
      Afbeeldingen: <span class="font-bold">{combinedImages.length}</span>
      {#if showDiskSize}
        , grootte op shijf:
        <span class="font-bold">{byteSize(fileSize)}</span>
      {/if}
    </div>
  {/if}
  <!-- SelectedImages viewer -->
  {#if combinedImages.length}
    <div
      class="flex flex-col input-bordered border-2 rounded-lg min-h-12 bg-base-100 justify-center"
      class:mt-1={remainingSpace}
      use:dndzone={{
        items: dragableImages,
        dragDisabled: dragDisabled || !sortable || maxAmount <= 1,
        flipDurationMs: FLIP_DURATION,
        dropTargetStyle: {},
      }}
      on:consider={handleConsider}
      on:finalize={handleFinalize}
    >
      {#each dragableImages as image, i (image)}
        <DropzoneFilePreview
          image={disablePreviews ? faImage : image.data}
          imageName={image.data instanceof File
            ? image.data.name
            : "Geüpload bestand"}
          remove={() => remove(i)}
          bind:dragDisabled
          dragFullyDisabled={!sortable || maxAmount <= 1}
          isLast={i == combinedImages.length - 1}
          progress={progress?.[i] || undefined}
          {saving}
          {onPreviewFinishedLoading}
        />
      {/each}
    </div>
  {/if}
  {#if !disablePreviews && amountOfFinishedPreviews < combinedImages.length}
    <div class="flex items-center gap-2">
      <span class="loading loading-ring" />
      <span class="opacity-60">Afbeeldingen laden</span>
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
