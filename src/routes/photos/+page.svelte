<script lang="ts">
  import InfoCard from "$components/alerts/InfoCard.svelte"
  import PhotoAlbumViewer from "$components/photoAlbum/PhotoAlbumViewer.svelte"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { photoAlbumStore } from "$lib/stores/PhotoAlbumStore"
  import "bigger-picture/css"

  $: photoAlbums = $photoAlbumStore || []
  $: filteredPhotoAlbums = photoAlbums.filter((e) => e.visible)

  // -- Page title --
  pageHeadStore.updatePageTitle("Foto's")
</script>

<!-- Title -->
<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold mb-1">Foto's</h1>
  {#await authStore.known then _}
    {#if $authStore}
      <a class="btn btn-sm btn-primary" href="/photos/new"> Nieuw album </a>
    {/if}
  {/await}
</div>

<InfoCard class="w-full mb-2">
  <div>
    <h3 class="font-bold">🚧Pagina in aanbouw🚧</h3>
    <div class="text-xs">
      Foto's kunnen nog niet beken worden, enkel administrators kunnen albums
      downloaden
    </div>
  </div>
</InfoCard>

{#if $photoAlbumStore}
  <ul class="menu bg-base-200 rounded-box mb-4">
    <li>
      <h2 class="menu-title">Albums</h2>
      <ul>
        {#each filteredPhotoAlbums as photoAlbum}
          <li>
            <a
              class="btn btn-ghost h-9 min-h-min justify-start w-fit"
              href={"#" + photoAlbum.id}>{photoAlbum.title}</a
            >
          </li>
        {/each}
      </ul>
    </li>
  </ul>

  {#each filteredPhotoAlbums as photoAlbum}
    <PhotoAlbumViewer {photoAlbum} />
  {/each}
{:else}
  Loading
{/if}
