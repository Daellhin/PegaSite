<script lang="ts">
  import { preferencesStore } from "$lib/stores/LocalStorageStores"
  import { clamp } from "$lib/utils/Utils"
  import {
    faChevronLeft,
    faChevronRight,
  } from "@fortawesome/free-solid-svg-icons"
  import { onMount } from "svelte"
  import Fa from "svelte-fa"

  export let images: { imageUrl: string; alt?: string }[]
  export let height = ""
  export let hideButtons = false
  export let hideIndicators = false
  export let fillWidth = false
  export let loop = false
  export let duration = 10000

  // -- Counter --
  export let counter = 0
  $: counter = clamp(counter, 0, images.length - 1)
  function next() {
    counter = (counter + 1) % images.length
  }
  function previous() {
    counter = (counter - 1 + images.length) % images.length
  }

  // -- Looping --
  let loopTimeout: number
  let mounted = false

  onMount(() => (mounted = true))

  function setLoop() {
    clearTimeout(loopTimeout)
    loopTimeout = window.setTimeout(() => {
      next()
      setLoop()
    }, duration)
  }
  $: if (mounted && loop && $preferencesStore.autoPlay) setLoop()
  else clearTimeout(loopTimeout)
</script>

<!-- Adapted from https://flowbite.com/docs/components/carousel/ -->
<!-- Carousel container -->
<div
  class={`relative bg-base-200 h-72 sm:h-96 w-full overflow-hidden rounded-lg ${height}`}
>
  <!-- Carousel images -->
  {#each images as item, i}
    <img
      src={item.imageUrl}
      class:opacity-0={counter !== i}
      class={`rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ease-in-out transition-opacity duration-700 ${
        fillWidth ? "" : "h-full object-contain"
      }`}
      alt={item.alt}
    />
  {/each}
  <!-- Slide indicators -->
  {#if images.length > 1 && !hideIndicators}
    <div class="absolute flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
      {#each images as _, i}
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
          type="button"
          class="w-3 h-3 rounded-full"
          class:bg-slate-200={counter === i}
          class:bg-slate-500={counter !== i}
          on:click={() => (counter = i)}
        ></button>
      {/each}
    </div>
  {/if}
  <!-- Slide buttons -->
  {#if images.length > 1 && !hideButtons}
    <button
      type="button"
      class="absolute top-0 left-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-hidden"
      on:click={previous}
    >
      <span
        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-400/30 dark:bg-gray-800/30 group-hover:bg-slate-500/50 dark:group-hover:bg-gray-800/60 group-focus:bg-slate-500/50 dark:group-focus:bg-slate-500/50"
      >
        <Fa
          icon={faChevronLeft}
          class="text-white dark:text-slate-500 text-xl"
        />
        <span class="sr-only">Volgende</span>
      </span>
    </button>
    <button
      type="button"
      class="absolute top-0 right-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-hidden"
      on:click={next}
    >
      <span
        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-400/30 dark:bg-gray-800/30 group-hover:bg-slate-500/50 dark:group-hover:bg-gray-800/60 group-focus:bg-slate-500/50 dark:group-focus:bg-slate-500/50"
      >
        <Fa
          icon={faChevronRight}
          class="text-white dark:text-slate-500 text-xl"
        />
        <span class="sr-only">Vorige</span>
      </span>
    </button>
  {/if}
</div>
