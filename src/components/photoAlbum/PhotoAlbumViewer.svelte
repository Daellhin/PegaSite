<script lang="ts">
  import ShowMore from "$components/ShowMore.svelte"
  import type { PhotoAlbum } from "$lib/domain/PhotoAlbum"
  import { faCalendar } from "@fortawesome/free-regular-svg-icons"
  import { faCameraRetro, faImage } from "@fortawesome/free-solid-svg-icons"
  import "bigger-picture/css"
  import { onMount } from "svelte"
  import Masonry from "svelte-bricks"
  import Fa from "svelte-fa"
  import Time from "svelte-time/Time.svelte"
  import BiggerPictureThumbnails from "./thumbnails.svelte"

  export let photoAlbum: PhotoAlbum

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
        `.imageAnchor.${photoAlbum.id}`,
      ),
    )
  })

  function openGallery(e: MouseEvent) {
    imageAnchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        `.imageAnchor.${photoAlbum.id}`,
      ),
    )
    e.preventDefault()
    biggerPictureInstance.open({
      items: imageAnchors,
      el: e.currentTarget!,
    })
  }
</script>

<svelte:window bind:innerWidth />

<div class="mb-4" id={photoAlbum.id}>
  <div>
    <div class="flex">
      <div class="min-w-fit font-semibold text-xl">
        <span class="capitalize">{photoAlbum.title}</span>
      </div>
      <hr class="my-auto ml-3 w-full h-[1.5px] bg-gray-200" />
    </div>
    <!-- Tags -->
    <div class="flex gap-2">
      <div class="flex flex-row gap-1 items-center">
        <div class="h-3 my-auto" title="Datum">
          <Fa icon={faCalendar} />
        </div>
        <Time class="opacity-60" timestamp={photoAlbum.date} />
      </div>
      <div class="flex flex-row gap-1 items-center">
        <div class="h-3 my-auto" title="Aantal afbeeldingen">
          <Fa icon={faImage} />
        </div>
        <span class="opacity-60"
          >{photoAlbum.imageUrls.length}
          {photoAlbum.imageUrls.length > 1
            ? "afbeeldingen"
            : "afbeelding"}</span
        >
      </div>
      <div class="flex flex-row gap-1 items-center">
        <div class="h-3 my-auto" title="Fotograaf">
          <Fa icon={faCameraRetro} />
        </div>
        <a href={photoAlbum.authorUrl} class="opacity-60 link"
          >{photoAlbum.author}</a
        >
      </div>
    </div>
  </div>

  <div class="mt-2">
    <ShowMore startHeightPx={innerWidth < 472 ? 700 : 500}>
      <Masonry
        items={photoAlbum.imageUrls}
        {minColWidth}
        {maxColWidth}
        {gap}
        let:item
      >
        <a
          class={"imageAnchor " + photoAlbum.id}
          href={item}
          data-img={item}
          data-thumb={item}
          on:click={openGallery}
        >
          <img
            src={item}
            class="h-full w-full object-cover object-center rounded-lg"
          />
        </a>
      </Masonry>
    </ShowMore>
  </div>
</div>

<style lang="postcss">
  :global(.bp-wrap img) {
    @apply object-contain !important;
  }
  :global(.bp-wrap .bp-img) {
    @apply bg-none !important;
  }
</style>
