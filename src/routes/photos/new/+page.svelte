<script lang="ts">
  import { goto } from "$app/navigation"
  import PhotoAlbumForm from "$components/photoAlbum/PhotoAlbumForm.svelte"
  import PhotoAlbumViewer from "$components/photoAlbum/PhotoAlbumViewer.svelte"
  import { PhotoAlbum } from "$lib/domain/PhotoAlbum"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { photoAlbumStore } from "$lib/stores/PhotoAlbumStore"
  import { PreviewableFile } from "$lib/utils/PreviewableFile"
  import { pushCreatedToast } from "$lib/utils/Toast"
  import { UploadProgress } from "$lib/utils/UploadProgress"
  import byteSize from "byte-size"
  import type { Dayjs } from "dayjs"
  import dayjs from "dayjs"
  import { writable } from "svelte/store"

  const progressStore = writable([] as UploadProgress[])

  let title = ""
  // TODO does this need to be combinedImages?
  let combinedImages: (string | File)[] = []
  let visible = true
  let author = ""
  let authorUrl = ""
  let date: Dayjs

  async function savePhotoAlbum() {
    if (combinedImages.map((e) => e instanceof File).some((e) => e === false))
      throw new Error(
        "All images must be files when creating a new photo album",
      )
    const images = combinedImages.map((e) => e as File)
    const newPhotoAlbum = new PhotoAlbum(
      "-1",
      dayjs(),
      date,
      author,
      authorUrl,
      title,
      [],
      visible,
    )
    progressStore.set(combinedImages.map(() => UploadProgress.NOT_STARTED))
    const size = await photoAlbumStore.createPhotoAlbum(
      newPhotoAlbum,
      images,
      progressStore,
    )
    combinedImages = newPhotoAlbum.imageIds
    pushCreatedToast(`Fotoalbum aangemaakt (${byteSize(size)})`, {
      gotoUrl: `/photos/#${newPhotoAlbum.id}`,
    })
  }

  // -- Preview --
  let showPreview = false
  function togglePreview() {
    showPreview = !showPreview
  }
  async function createPreview() {
    console.info(combinedImages)
    const images = await Promise.all(
      combinedImages.map((e) => PreviewableFile.getMixedFilePreview(e, false)),
    )
    return new PhotoAlbum(
      "PreviewID",
      dayjs(),
      date,
      author,
      authorUrl,
      title,
      images,
      visible,
      true,
    )
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Nieuw Fotoalbum")
</script>

{#if showPreview}
  <!-- Article preview -->
  {#await createPreview()}
    <div>Loadig</div>
  {:then previewPhotoAlbum}
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Sluit preview
    </button>
    <div class="md:mx-2 mb-4 sm:mb-10">
      <PhotoAlbumViewer photoAlbum={previewPhotoAlbum} preview />
    </div>
  {/await}
{:else}
  <!-- Photo album editor -->
  <div class="flex flex-row gap-3 items-center mb-1">
    <h1 class="text-2xl font-bold">Nieuw Fotoalbum</h1>
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Toon preview
    </button>
  </div>

  <PhotoAlbumForm
    bind:title
    bind:combinedImages
    bind:visible
    bind:author
    bind:authorUrl
    bind:date
    newPhotoAlbum={true}
    submitLabel="Album aanmaken"
    onSave={savePhotoAlbum}
    progress={$progressStore}
    stopAfterSave
    savedMessage={"Album succesvol aangemaakt"}
  />
{/if}
