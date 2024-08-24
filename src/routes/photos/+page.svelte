<script lang="ts">
  import PhotoAlbumViewer from "$components/photoAlbum/PhotoAlbumViewer.svelte"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { photoAlbumStore } from "$lib/stores/PhotoAlbumStore"
  import "bigger-picture/css"

  $: photoAlbums = ($photoAlbumStore || [])
    .filter((e) => e.visible)
    .sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1))

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

{#if $photoAlbumStore}
  {#if photoAlbums.length > 0}
    <ul class="menu bg-base-200 rounded-box mb-4">
      <li>
        <h2 class="menu-title">Albums</h2>
        <ul>
          {#each photoAlbums as photoAlbum}
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

    {#each photoAlbums as photoAlbum}
      <PhotoAlbumViewer {photoAlbum} />
    {/each}
  {:else}
    Geen foto albums
  {/if}
{:else}
  Loading
{/if}
