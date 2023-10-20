<script lang="ts">
  import Carousel from "$components/carousel/Carousel.svelte"
  import { preferencesStore } from "$lib/stores/LocalStorageStores"
  import {
    faExternalLink,
    faPause,
    faPlay,
  } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  type Item = {
    name: string
    url: string
    imageUrl: string
  }

  export let items = Array<Item>()
  export let hideButtons = true
  export let hideIndicators = false
  export let loop = false
  export let duration = 10000

  let counter = 0

  function toggleAutoPlay() {
    preferencesStore.set({ autoPlay: !$preferencesStore.autoPlay })
  }
</script>

<div class="bg-base-200 rounded-lg p-2 pt-1">
  <div class="box-content">
    <!-- Loop controls -->
    {#if loop}
      <div class="flex justify-between">
        <hr class="w-full mt-3 border-2 rounded-xl mr-1 border-base-content" />
        <button
          class="btn btn-ghost btn-xs flex items-center gap-2 mb-1 ml-auto"
          on:click={toggleAutoPlay}
          title={$preferencesStore.autoPlay ? "Pauze" : "Play"}
        >
          <span class=" font-bold">Autoplay</span>
          <Fa
            icon={$preferencesStore.autoPlay ? faPause : faPlay}
            class="text-lg"
          />
        </button>
      </div>
    {/if}
    <Carousel
      bind:counter
      images={items.map((e) => ({
        imageUrl: e.imageUrl,
        alt: "Logo " + e.name,
      }))}
      height="h-56 sm:h-96 lg:h-44 2xl:h-52"
      {hideButtons}
      {hideIndicators}
      {loop}
      {duration}
      fillWidth
    />
  </div>
  <!-- Sponsor Info -->
  <div class="flex items-center justify-between mt-2">
    <span class="text-lg font-semibold">
      {items[counter].name}
    </span>
    <a href={items[counter].url} class="btn btn-sm" target="_blank">
      Site
      <Fa icon={faExternalLink} class="text-lg" />
    </a>
  </div>
</div>
