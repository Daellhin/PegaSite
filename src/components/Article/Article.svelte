<script lang="ts">
  import Time from "svelte-time";
  import FaRegCalendar from "svelte-icons/fa/FaRegCalendar.svelte";
  import FaUser from "svelte-icons/fa/FaUser.svelte";
  import type { Article } from "$lib/article";
  import { readFileAsDataURL } from "$lib/utils/utils";
  import { Carousel } from "flowbite-svelte";

  const images = [
    {
      id: 0,
      name: "Cosmic timetraveler",
      imgurl: "/images/temp.webp",
    },
    {
      id: 1,
      name: "Cosmic timetraveler",
      imgurl: "/images/shoe.jpg",
    },
  ];

  export let article: Article;
</script>

<!-- Title -->
<h1 class="text-5xl">{article.title}</h1>
<!-- Article data -->
<div class="flex flex-row gap-3 ml-1">
  <!-- Time -->
  <div class="flex flex-row gap-1 items-center">
    <div class="w-4 h-4">
      <FaRegCalendar />
    </div>
    <Time class="opacity-60 text-md" timestamp={article.timestamp} />
  </div>
  <!-- Metadata -->
  <div class="flex flex-row gap-1 items-center">
    <div class="w-4 h-4">
      <FaUser />
    </div>
    <span class="opacity-60 text-md">{article.author}</span>
  </div>
</div>

<!-- Tags -->
<div class="flex flex-row gap-2 mt-2">
  {#each article.tags as tag}
    <div class="badge badge-primary badge-lg">{tag}</div>
  {/each}
</div>

<!-- Carousel -->
<div class="custom-brackground my-2 rounded-lg">
  <div class="max-w-xl mx-auto custom-carousel">
    <Carousel {images} showCaptions={false} showThumbs={false} />
  </div>
</div>

<!-- Conent -->
<div class="usercontent">
  {@html article.content}
</div>

<style lang="postcss">
  @import "../../css/usercontent.postcss";

  .custom-carousel :global(img) {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    border-radius: 0.5em;
  }

  .custom-brackground {
    @apply bg-base-200;
  }
</style>
