<script lang="ts">
  import Time from "svelte-time";
  import FaRegCalendar from "svelte-icons/fa/FaRegCalendar.svelte";
  import FaUser from "svelte-icons/fa/FaUser.svelte";
  import type { Article } from "$lib/article";
  import { readFileAsDataURL } from "$lib/utils/utils";
  import { goto } from "$app/navigation";
  import Carousel from "../Carousel.svelte";

  export let article: Article;

  function trigger(event:any) {
    event.preventDefault();
    goto("#item4")

  }
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
<!-- Image -->
<!-- <div class="carousel w-full">
  <div id="item1" class="carousel-item w-full">
    {#await readFileAsDataURL(article.images[0]) then src}
      <img {src} alt={article.images[0].name} class="w-full" />
    {:catch error}
      <div>{error}</div>
    {/await}
  </div>
  <div id="item2" class="carousel-item w-full">
    {#await readFileAsDataURL(article.images[0]) then src}
      <img {src} alt={article.images[0].name} class="w-full" />
    {/await}
  </div>
  <div id="item3" class="carousel-item w-full">
    {#await readFileAsDataURL(article.images[0]) then src}
      <img {src} alt={article.images[0].name} class="w-full" />
    {/await}
  </div>
  <div id="item4" class="carousel-item w-full">
    {#await readFileAsDataURL(article.images[0]) then src}
      <img {src} alt={article.images[0].name} class="w-full" />
    {/await}
  </div>
</div>
<div class="flex justify-center w-full py-2 gap-2">
  <a href="#item1" class="btn btn-xs" on:click={trigger}>1</a>
  <a href="#item2" class="btn btn-xs" on:click={trigger}>2</a>
  <a href="#item3" class="btn btn-xs" on:click={trigger}>3</a>
  <a href="#item4" class="btn btn-xs" on:click={trigger}>4</a>
</div> -->


<!-- Conent -->
<div class="usercontent">
  {@html article.content}
</div>

<style lang="postcss">
  @import "../../css/usercontent.postcss";
</style>
