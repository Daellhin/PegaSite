<script lang="ts">
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { faImage } from "@fortawesome/free-solid-svg-icons"
  import "bigger-picture/css"
  import { onMount } from "svelte"
  import Masonry from "svelte-bricks"
  import Fa from "svelte-fa"
  import BiggerPictureThumbnails from "./thumbnails.svelte"

  const [minColWidth, maxColWidth, gap] = [200, 800, 20]

  let biggerPictureInstance: any
  let imageAnchors: HTMLAnchorElement[]

  const imageLinks = [
    {
      url: "https://assets.henrygd.me/bp/images/janko-ferlic-SDivo1PTBDs-unsplash.jpg",
      id: 0,
    },
    {
      url: "https://assets.henrygd.me/bp/images/corey-agopian-5y4ljzRrDFA-unsplash.jpg",
      id: 1,
    },
    {
      url: "https://assets.henrygd.me/bp/images/veeterzy-EYcvA56gSjU.jpg",
      id: 2,
    },
    {
      url: "https://assets.henrygd.me/bp/images/andrew-svk-REwZEYzw19g-unsplash.jpg",
      id: 3,
    },
    {
      url: "https://assets.henrygd.me/bp/images/harshil-gudka-9GptkQwAAsc-unsplash.jpg",
      id: 4,
    },
    {
      url: "https://assets.henrygd.me/bp/images/joshua-sukoff-sZ5zbZMAYJs-unsplash.jpg",
      id: 5,
    },
    {
      url: "https://assets.henrygd.me/bp/images/daniel-sessler-5El_7dJ0kKo-unsplash.jpg",
      id: 6,
    },
    {
      url: "https://assets.henrygd.me/bp/images/veeterzy-EYcvA56gSjU.jpg",
      id: 7,
    },
    {
      url: "https://assets.henrygd.me/bp/images/andrew-svk-REwZEYzw19g-unsplash.jpg",
      id: 8,
    },
    {
      url: "https://assets.henrygd.me/bp/images/harshil-gudka-9GptkQwAAsc-unsplash.jpg",
      id: 9,
    },
    {
      url: "https://assets.henrygd.me/bp/images/joshua-sukoff-sZ5zbZMAYJs-unsplash.jpg",
      id: 10,
    },
    {
      url: "https://assets.henrygd.me/bp/images/daniel-sessler-5El_7dJ0kKo-unsplash.jpg",
      id: 11,
    },
    {
      url: "https://assets.henrygd.me/bp/images/janko-ferlic-SDivo1PTBDs-unsplash.jpg",
      id: 12,
    },
    {
      url: "https://assets.henrygd.me/bp/images/corey-agopian-5y4ljzRrDFA-unsplash.jpg",
      id: 13,
    },
    {
      url: "https://assets.henrygd.me/bp/images/veeterzy-EYcvA56gSjU.jpg",
      id: 14,
    },
    {
      url: "https://assets.henrygd.me/bp/images/andrew-svk-REwZEYzw19g-unsplash.jpg",
      id: 15,
    },
    {
      url: "https://assets.henrygd.me/bp/images/harshil-gudka-9GptkQwAAsc-unsplash.jpg",
      id: 16,
    },
    {
      url: "https://assets.henrygd.me/bp/images/joshua-sukoff-sZ5zbZMAYJs-unsplash.jpg",
      id: 17,
    },
    {
      url: "https://assets.henrygd.me/bp/images/daniel-sessler-5El_7dJ0kKo-unsplash.jpg",
      id: 18,
    },
  ]
  $: indexes = Array.from(Array(imageLinks.length).keys())

  onMount(() => {
    biggerPictureInstance = new BiggerPictureThumbnails({
      target: document.body,
    })
    imageAnchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".imageAnchor"),
    )
  })

  function openGallery(e: MouseEvent) {
    imageAnchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".imageAnchor"),
    )
    e.preventDefault()
    biggerPictureInstance.open({
      items: imageAnchors,
      el: e.currentTarget!,
    })
  }

  // -- Page title --
  pageHeadStore.updatePageTitle("Foto's")
</script>

<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold">Foto's</h1>
</div>

{#each Array(3) as item}
  <div class="mb-4">
    <div>
      <div class="flex">
        <div class="min-w-fit font-semibold text-xl">
          <span class="capitalize">{"Atletiekstage 2024 - Dag 1"}</span>
        </div>
        <hr class="my-auto ml-3 w-full h-[1.5px] bg-gray-200" />
      </div>
      <div class="flex flex-row gap-1 items-center">
        <div class="h-3 my-auto">
          <Fa icon={faImage} />
        </div>
        <span class="opacity-60">{26} afbeeldingen</span>
      </div>
    </div>

    <div class="mt-2">
      <Masonry items={imageLinks} {minColWidth} {maxColWidth} {gap} let:item>
        <a
          class="imageAnchor"
          href={item.url}
          data-img={item.url}
          data-thumb={item.url}
          on:click={openGallery}
        >
          <img
            src={item.url}
            class="h-full w-full object-cover object-center rounded-lg"
          />
        </a>
      </Masonry>
    </div>
  </div>
{/each}

<style lang="postcss">
  :global(.bp-wrap img) {
    @apply object-contain !important;
  }
  :global(.bp-wrap .bp-img) {
    @apply bg-none !important;
  }
</style>
