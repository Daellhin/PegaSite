<script lang="ts">
  import { faImage } from "@fortawesome/free-solid-svg-icons"
  import "bigger-picture/css"
  import { onMount } from "svelte"
  import Fa from "svelte-fa"
  import BiggerPictureThumbnails from "./thumbnails.svelte"

  export let thumbnailUrls: string[]
  export let imageUrls: string[]
  export let id: string

  let innerWidth = 0
  let imageWidths = [] as number[]
  let imageHeights = [] as number[]

  $: gridCols = getGridCols(innerWidth)
  $: gridSpan2 = calculateGridSpans(
    thumbnailUrls,
    gridCols,
    imageWidths,
    imageHeights,
  )

  function getGridCols(screenWidth: number) {
    switch (true) {
      case screenWidth < 640: // Below 'sm'
        return 1
      case screenWidth >= 640 && screenWidth < 768: // 'sm'
        return 1
      case screenWidth >= 768 && screenWidth < 1024: // 'md'
        return 1
      case screenWidth >= 1024 && screenWidth < 1280: // 'lg'
        return 4
      case screenWidth >= 1280 && screenWidth < 1536: // 'xl'
        return 6
      case screenWidth >= 1536: // '2xl'
        return 8
      default:
        return 0
    }
  }

  function calculateGridSpans(
    images: string[],
    gridCols: number,
    imageWidths: number[],
    imageHeights: number[],
  ) {
    if (innerWidth < 0) return Array(images.length).fill(false)

    let currentRowFill = 0

    return images.map((image, index) => {
      const isWide =
        imageWidths[index] && imageHeights[index]
          ? imageWidths[index] > 1.2 * imageHeights[index]
          : false
      const span2 = isWide && currentRowFill + 2 <= gridCols

      currentRowFill = (currentRowFill + (span2 ? 2 : 1)) % gridCols
      return span2
    })
  }

  // -- Bigger picture --
  let biggerPictureInstance: BiggerPictureThumbnails
  let imageAnchors: HTMLAnchorElement[]

  onMount(() => {
    biggerPictureInstance = new BiggerPictureThumbnails({
      target: document.body,
    })
    imageAnchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(`#ID-${id} .imageAnchor`),
    )
  })

  function openGallery(e: MouseEvent) {
    imageAnchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(`#ID-${id} .imageAnchor`),
    )
    e.preventDefault()
    biggerPictureInstance.open({
      items: imageAnchors,
      el: e.currentTarget!,
    })
  }
</script>

<svelte:window bind:innerWidth />

<div id={`ID-${id}`} class="mx-auto w-full">
  <div
    class="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-4"
  >
    {#each thumbnailUrls as thumbnail, index}
      <a
        href={imageUrls[index]}
        data-img={imageUrls[index]}
        data-thumb={thumbnail}
        on:click={openGallery}
        class="imageAnchor relative flex h-48 items-end overflow-hidden rounded-lg md:h-80"
        class:md:col-span-2={gridSpan2[index]}
      >
        <img
          loading="lazy"
          src={thumbnail}
          class="absolute inset-0 h-full w-full object-cover object-center"
          alt="Afbeelding {index+1}"
          bind:naturalWidth={imageWidths[index]}
          bind:naturalHeight={imageHeights[index]}
        />
        <div
          class="flex items-center justify-center w-full h-full bg-base-300 rounded-t-lg"
        >
          <Fa icon={faImage} size="lg" />
        </div>
      </a>
    {/each}
  </div>
</div>
