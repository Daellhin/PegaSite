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
  import JSZip from "jszip"
  import { onMount } from "svelte"
  import Masonry from "svelte-bricks"
  import Fa from "svelte-fa"
  import Time from "svelte-time/Time.svelte"
  import BiggerPictureThumbnails from "./thumbnails.svelte"

  export let photoAlbum: PhotoAlbum
  export let preview = false

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

  // -- Bigger picture --
  const minColWidth = 200
  const maxColWidth = 800
  const gap = 20

  let biggerPictureInstance: BiggerPictureThumbnails
  let imageAnchors: HTMLAnchorElement[]
  let innerWidth: number

  onMount(() => {
    biggerPictureInstance = new BiggerPictureThumbnails({
      target: document.body,
    })
    imageAnchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        `.imageAnchor.ID-${photoAlbum.id}`,
      ),
    )
  })

  function openGallery(e: MouseEvent) {
    imageAnchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        `.imageAnchor.ID-${photoAlbum.id}`,
      ),
    )
    e.preventDefault()
    biggerPictureInstance.open({
      items: imageAnchors,
      el: e.currentTarget!,
    })
  }

  async function downloadHandler() {
    const zip = new JSZip()
    const imgFolder = zip.folder("images")
    if (!imgFolder) throw new Error("No image folder")

    for (const [index, url] of photoAlbum.imageUrls.entries()) {
      const response = await fetch(url)
      const blob = await response.blob()
      imgFolder.file(`image${index + 1}.jpg`, blob)
    }

    const content = await zip.generateAsync({ type: "blob" })
    saveAs(content, "images.zip")
  }

  function saveAs(blob: Blob, name: string) {
    var a = document.createElement("a")
    document.body.append(a)
    a.download = name
    a.href = URL.createObjectURL(blob)
    a.click()
    a.remove()
  }
</script>

<svelte:window bind:innerWidth />

<div class="mb-4" id={photoAlbum.id}>
  <!-- Title -->
  <div class="flex">
    <div class="min-w-fit font-semibold text-xl">
      <span class="capitalize">{photoAlbum.title}</span>
    </div>
    <hr class="my-auto ml-3 w-full h-[1.5px] bg-gray-200" />
  </div>

  <!-- Data -->
  <div class="flex gap-2">
    <div class="flex gap-1 items-center">
      <div class="h-3 my-auto" title="Datum">
        <Fa icon={faCalendar} />
      </div>
      <Time class="opacity-60" timestamp={photoAlbum.date} />
    </div>
    <div class="flex gap-1 items-center">
      <div class="h-3 my-auto" title="Aantal afbeeldingen">
        <Fa icon={faImage} />
      </div>
      <span class="opacity-60"
        >{photoAlbum.imageUrls.length}
        {photoAlbum.imageUrls.length > 1 ? "afbeeldingen" : "afbeelding"}</span
      >
    </div>
    {#if photoAlbum.author}
      <div class="flex gap-1 items-center">
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
  <!-- <div class="mt-2">
    <ShowMore startHeightPx={innerWidth < 472 ? 700 : 500}>
      <Masonry
        items={photoAlbum.imageUrls}
        {minColWidth}
        {maxColWidth}
        {gap}
        let:item
      >
        <a
          class={`imageAnchor ID-${photoAlbum.id}`}
          href={item}
          data-img={item}
          data-thumb={item}
          on:click={openGallery}
        >
          <img
            src={item}
            class="h-full w-full object-cover object-center rounded-lg"
            loading="lazy"
          />
        </a>
      </Masonry>
    </ShowMore>
  </div> -->
</div>

<ConfirmModal {confirmModalID} onConfirm={deletePhotoAlbum} bind:showModal>
  Bent u zeker dat u het <span class="font-semibold">"{photoAlbum.title}"</span>
  fotoalbum en
  <span class="font-semibold">"{photoAlbum.imageUrls.length}"</span> geasocierde
  fotos wilt verwijderen?
</ConfirmModal>

<style lang="postcss">
  :global(.bp-wrap img) {
    @apply object-contain !important;
  }
  :global(.bp-wrap .bp-img) {
    @apply bg-none !important;
  }
</style>
