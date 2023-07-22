<script lang="ts">
  import { preferencesStore } from "$lib/stores/LocalStorrageStores";
  import {
    faChevronLeft,
    faChevronRight,
    faExternalLink,
    faPause,
    faPlay,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  type Item = {
    name: string;
    url: string;
    imageUrl: string;
  };

  export let items = Array<Item>();
  export let hideIndicators = false;
  export let loop = false;
  export let duration = 10000;

  let counter = 0;

  function toggleAutoPlay() {
    preferencesStore.set({ autoPlay: !$preferencesStore.autoPlay });
  }
  function next() {
    counter = (counter + 1) % items.length;
  }
  function previous() {
    counter = (counter - 1) % items.length;
  }

  // -- Looping --
  let loopTimeout: NodeJS.Timeout | undefined;

  function setLoop() {
    clearTimeout(loopTimeout);
    loopTimeout = setTimeout(() => {
      next();
      setLoop();
    }, duration);
  }
  $: if (loop && $preferencesStore.autoPlay) setLoop();
  else clearTimeout(loopTimeout);
</script>

<!-- Adapted from https://flowbite.com/docs/components/carousel/ -->
<div class="bg-base-200 rounded-lg p-2 pt-1">
  <div class="box-content">
    {#if loop}
      <div class="flex justify-between">
        <hr class="w-full mt-3 border-2 rounded-xl mr-1 border-base-content" />
        <button
          class="btn btn-ghost btn-xs flex items-center gap-2 mb-1 ml-auto"
          on:click={() => toggleAutoPlay()}
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
    <div
      class="rounded mx-auto lg:h-[180px] overflow-hidden custom-carousel relative"
    >
      <div id="default-carousel" class=" w-full">
        <!-- Carousel wrapper -->
        <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
          {#each items as item, i}
            <img
              src={item.imageUrl}
              class:opacity-100={counter === i}
              class:opacity-0={counter !== i}
              class="absolute duration-1000 ease-in-out transition-opacity"
              alt="Logo"
            />
          {/each}
        </div>

        <!-- Slider indicators -->
        <div
          class="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2"
        >
          {#each items as _, i}
            <button
              type="button"
              class="w-3 h-3 rounded-full"
              class:bg-slate-200={counter === i}
              class:bg-slate-500={counter !== i}
              on:click={() => (counter = i)}
            />
          {/each}
        </div>
        <!-- Slider controls -->
        {#if items.length > 1 && !hideIndicators}
          <button
            type="button"
            class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            on:click={previous}
          >
            <span
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"
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
            class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            on:click={next}
          >
            <span
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"
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
    </div>
  </div>
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
