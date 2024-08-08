<script lang="ts">
  import { goto } from "$app/navigation"
  import PhotoAlbumForm from "$components/photoAlbum/PhotoAlbumForm.svelte"
  import { PhotoAlbum } from "$lib/domain/PhotoAlbum"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { photoAlbumStore } from "$lib/stores/PhotoAlbumStore"
  import { pushCreatedToast } from "$lib/utils/Toast"
  import type { Dayjs } from "dayjs"
  import dayjs from "dayjs"

  let title = ""
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
    await photoAlbumStore.createPhotoAlbum(newPhotoAlbum, images)
    pushCreatedToast("Foto album aangemaakt", {
      gotoUrl: `/photos/#${newPhotoAlbum.id}`,
    })
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Foto's beheren")
</script>

<!-- Title -->
<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold">Foto album aanmaken</h1>
</div>

<PhotoAlbumForm
  bind:title
  bind:combinedImages
  bind:visible
  bind:author
  bind:authorUrl
  bind:date
  submitLabel="Album aanmaken"
  onSave={savePhotoAlbum}
></PhotoAlbumForm>
