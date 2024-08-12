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
  import { faCalendar } from "@fortawesome/free-regular-svg-icons"
  import type { Dayjs } from "dayjs"
  import Fa from "svelte-fa"
  import Time from "svelte-time/Time.svelte"
  import { writable } from "svelte/store"
  import type { PageData } from "./$types"
  import type { UploadProgress } from "$lib/utils/UploadProgress"

  export let data: PageData

  const progressStore = writable([] as UploadProgress[])

  let title = ""
  let combinedImages: (string | File)[] = []
  let visible = true
  let author = ""
  let authorUrl = ""
  let date: Dayjs
  let createdAt: Dayjs

  async function savePhotoAlbum() {
    if (!photoAlbum) return
    await photoAlbumStore.updatePhotoAlbum(
      title,
      visible,
      author,
      authorUrl,
      date,
      combinedImages,
      photoAlbum,
      progressStore,
    )
    pushCreatedToast("Fotoalbum bijgewerkt", {
      gotoUrl: `/photos/#${photoAlbum.id}`,
    })
  }

  // -- Preview --
  let showPreview = false
  function togglePreview() {
    showPreview = !showPreview
  }
  async function createPreview() {
    const images = await Promise.all(
      combinedImages.map(PreviewableFile.getMixedFilePreview),
    )
    return new PhotoAlbum(
      "PreviewID",
      createdAt,
      date,
      author,
      authorUrl,
      title,
      images,
      visible,
    )
  }

  // -- Data loading --
  let errorMessage = ""
  let photoAlbum: PhotoAlbum | undefined | null

  let haveValuesBeenSet = false
  $: $photoAlbumStore && loadPhotoAlbum(data)
  $: if (!haveValuesBeenSet && photoAlbum) setValues(photoAlbum)

  async function loadPhotoAlbum(data: PageData) {
    errorMessage = ""
    const foundPhotoAlbum = $photoAlbumStore.filter((e) => e.id === data.id)
    if (foundPhotoAlbum.length !== 1)
      errorMessage = `Could not find photoAlbum with ID "${data.id}"`
    photoAlbum = foundPhotoAlbum[0]
  }
  function setValues(photoAlbum: PhotoAlbum) {
    title = photoAlbum.title
    combinedImages = photoAlbum.imageUrls
    visible = photoAlbum.visible
    author = photoAlbum.author
    authorUrl = photoAlbum.authorUrl
    date = photoAlbum.date
    createdAt = photoAlbum.createdAt

    haveValuesBeenSet = true
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  $: photoAlbum && pageHeadStore.updatePageTitle(photoAlbum.title)
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
{:else if photoAlbum === undefined}
  Loading
{:else if photoAlbum}
  <!-- Photo album editor -->
  <div class="flex flex-row gap-3 items-center mb-1">
    <h1 class="text-2xl font-bold">Fotoalbum wijzigen</h1>
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Toon preview
    </button>
  </div>

  <div class="flex gap-1 items-center opacity-60 text-sm mb-2">
    <span class="">Aangemaakt op: </span>
    <div class="h-3 my-auto" title="Datum">
      <Fa icon={faCalendar} />
    </div>
    <Time timestamp={photoAlbum.date} />
  </div>

  <PhotoAlbumForm
    bind:title
    bind:combinedImages
    bind:visible
    bind:author
    bind:authorUrl
    bind:date
    submitLabel="Album wijzigen"
    progress={$progressStore}
    onSave={savePhotoAlbum}
  />
{:else}
  <div>"{data.id}": not found</div>
{/if}

{#if errorMessage}
  <p class="text-error">{errorMessage}</p>
{/if}
