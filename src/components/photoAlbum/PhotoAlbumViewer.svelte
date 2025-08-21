<script lang="ts">
  import ConfirmModal from "$components/ConfirmModal.svelte"
  import EditDropdown from "$components/EditDropdown.svelte"
  import ShowMore from "$components/ShowMore.svelte"
  import type { PhotoAlbum } from "$lib/domain/PhotoAlbum"
  import { authStore } from "$lib/stores/AuthStore"
  import { photoAlbumStore } from "$lib/stores/PhotoAlbumStore"
  import { pushCreatedToast } from "$lib/utils/Toast"
  import { faCalendar } from "@fortawesome/free-regular-svg-icons"
  import {
    faCameraRetro,
    faDownload,
    faImage,
  } from "@fortawesome/free-solid-svg-icons"
  import "bigger-picture/css"
  import { onMount } from "svelte"
  import Fa from "svelte-fa"
  import Time from "svelte-time/Time.svelte"
  import { writable } from "svelte/store"
  import ImageGallery from "./ImageGallery.svelte"

  export let photoAlbum: PhotoAlbum
  export let preview = false

  let innerWidth: number

  $: imageUrls = photoAlbum.getImageUrls()
  $: thumbnailUrls = photoAlbum.getThumbnailUrls()

  // -- Delete --
  const confirmModalID = "confirmPhotoAlbumDelete"
  let showModal = false

  async function startDelete() {
    showModal = true
  }
  async function deletePhotoAlbum() {
    const title = photoAlbum.title
    showModal = false
    await photoAlbumStore.deletePhotoAlbum(photoAlbum)
    pushCreatedToast(`Photoalbum "${title}" verwijderd`)
  }

  // -- Download --
  let downloading = false
  let progressStore = writable(0)

  async function downloadHandler() {
    ;(document.activeElement as HTMLElement).blur()
    downloading = true
    try {
      await photoAlbumStore.downloadZip(photoAlbum, progressStore)
    } catch (error) {
      console.error(error)
    }
    downloading = false
  }

  onMount(() => {
    // Prevent user accidentally leaving page when album is downloading
    window.addEventListener("beforeunload", (e) => {
      if (downloading) e.preventDefault()
    })
  })
</script>

<svelte:window bind:innerWidth />

<div class="mb-4" id={photoAlbum.id}>
  <!-- Title -->
  <div class="flex">
    <div class="min-w-fit font-semibold text-2xl">
      <span class="capitalize">{photoAlbum.title || "Geen titel"}</span>
    </div>
    <hr class="my-auto ml-3 w-full h-[1.5px] bg-gray-200" />
  </div>

  <!-- Data -->
  <div class="flex gap-2 flex-wrap">
    <div class="flex gap-1 items-center shrink-0">
      <div class="h-3 my-auto" title="Datum">
        <Fa icon={faCalendar} />
      </div>
      <Time class="opacity-60" timestamp={photoAlbum.date} />
    </div>
    <div class="flex gap-1 items-center shrink-0">
      <div class="h-3 my-auto" title="Aantal afbeeldingen">
        <Fa icon={faImage} />
      </div>
      <span class="opacity-60"
        >{imageUrls.length}
        {imageUrls.length > 1 ? "afbeeldingen" : "afbeelding"}</span
      >
    </div>
    {#if photoAlbum.author}
      <div class="flex gap-1 items-center shrink-0">
        <div class="h-3 my-auto" title="Fotograaf">
          <Fa icon={faCameraRetro} />
        </div>
        {#if photoAlbum.authorUrl}
          <a href={photoAlbum.authorUrl} class="opacity-60 link">
            {photoAlbum.author}
          </a>
        {:else}
          <span class="opacity-60">{photoAlbum.author}</span>
        {/if}
      </div>
    {/if}
    {#if downloading}
      <div class="flex gap-1 items-center shrink-0 h-auto">
        <progress
          class="progress progress-primary w-56 mt-1 ml-2"
          value={($progressStore / imageUrls.length) * 100}
          max={100}
          title="Downloaden"
        ></progress>
        <span class="font-semibold ml-2">
          {$progressStore} / {imageUrls.length}
        </span>
        Voltooid
      </div>
    {/if}

    {#if $authStore && !preview}
      <EditDropdown
        class="ml-auto"
        editUrl={"/photos/edit/" + photoAlbum.id}
        deleteHandler={startDelete}
        size="sm"
      >
        <li class="flex flex-row gap-1">
          <button on:click={downloadHandler} class="w-full">
            <Fa icon={faDownload} class="text-lg" />
            Album downloaden
          </button>
        </li>
      </EditDropdown>
    {/if}
  </div>

  <!-- Images -->
  <div class="mt-2">
    {#if photoAlbum.imageIds.length > 0}
    <ShowMore startHeightPx={innerWidth < 472 ? 700 : 500}>
      <ImageGallery {thumbnailUrls} id={photoAlbum.id} {imageUrls} />
    </ShowMore>
    {:else}
       Geen afbeeldingen
    {/if}
  </div>
</div>

<ConfirmModal {confirmModalID} onConfirm={deletePhotoAlbum} bind:showModal>
  Bent u zeker dat u het <span class="font-semibold">"{photoAlbum.title}"</span>
  fotoalbum en
  <span class="font-semibold">"{imageUrls.length}"</span> geasocierde fotos wilt
  verwijderen?
</ConfirmModal>

<style lang="postcss">
  @reference "tailwindcss";

  :global(.bp-wrap img) {
    @apply object-contain!;
  }
  :global(.bp-wrap .bp-img) {
    @apply bg-none!;
  }
</style>
