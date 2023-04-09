<!-- Component currently only supports previewing images -->
<script lang="ts">
  import {
    getFilesFromDragEvent,
    ignoreDragOver,
    readFileAsDataURL,
  } from "$lib/utils/Utils";
  import {
    faFileCircleExclamation,
    faXmark
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";
  import CloudIcon from "./icons/CloudIcon.svelte";

  export let files: File[];
  export let accept: string;
  export let dropzoneId = "file-dropzone";

  function onFileInput(e: Event & { currentTarget: HTMLInputElement }) {
    if (e.currentTarget.files) {
      const newFiles = Array.from(e.currentTarget.files).filter((e) =>
        e.type.match(accept)
      );
      files.push(...newFiles);

      files = files; // trigger update
    }
  }
  function handleDrop(event: DragEvent) {
    const droppedFiles = getFilesFromDragEvent(event);
    if (droppedFiles) {
      const newFiles = droppedFiles.filter((e) => e.type.match(accept));
      files.push(...newFiles);

      files = files; // trigger update
    }
  }
  function removeFile(toRemove: File) {
    files = files.filter((e) => e != toRemove);
  }
</script>

<div
  class="flex items-center justify-center w-full"
  on:drop={handleDrop}
  on:dragover={ignoreDragOver}
>
  <label
    id={dropzoneId}
    class="flex flex-col items-center justify-center w-full h-28 border-2 input-bordered border-color border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
  >
    <div class="flex flex-col items-center justify-center pt-5 pb-6">
      <div class="text-gray-700 dark:text-gray-400">
        <CloudIcon />
      </div>
      <p class="mb-2 text-sm font-semibold">
        Sleep hier of klik om afbeelding up te loaden
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG, GIF of WEBP
      </p>
    </div>
    <input
      id={dropzoneId}
      type="file"
      on:input={(e) => onFileInput(e)}
      class="hidden"
      {accept}
      multiple
    />
  </label>
</div>

{#if files.length}
  <div class="border-2 border-color rounded-lg input-bordered mt-2">
    {#each files as file, i}
      <div
        class="inline-flex items-center w-full px-4 py-2 text-sm border-color"
        class:border-b-2={i < files.length - 1}
      >
        <div class="flex flex-row gap-2">
          {#await readFileAsDataURL(file) then src}
            <img class="w-10 rounded-sm" alt={file.name} {src} />
          {:catch error}
            <div
              class="tooltip tooltip-right"
              data-tip="Bestand kan niet getoond worden"
            >
              <Fa icon={faFileCircleExclamation} />
              <div class="hidden">{error}</div>
            </div>
          {/await}
          <div class="my-auto">{file.name}</div>
        </div>
        <button
          class="btn btn-circle btn-xs hover:text-red-500 ml-auto"
          on:click={(e) => removeFile(file)}
        >
          <Fa icon={faXmark} />
        </button>
      </div>
    {/each}
  </div>
{/if}

<style lang="postcss">
  .border-color {
    border-color: hsl(var(--bc) / var(--tw-border-opacity));
  }
</style>
