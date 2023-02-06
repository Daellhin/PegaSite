<script lang="ts">
  import Time from "svelte-time";
  import FaRegCalendar from "svelte-icons/fa/FaRegCalendar.svelte";
  import FaUser from "svelte-icons/fa/FaUser.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<!-- Title -->
<h1 class="text-5xl">{data.article.title}</h1>
<!-- Article data -->
<div class="flex flex-row gap-3 ml-1">
  <!-- Time -->
  <div class="flex flex-row gap-1 items-center">
    <div class="w-4 h-4">
      <FaRegCalendar />
    </div>
    <Time class="opacity-60 text-md" timestamp={data.article.timestamp} />
  </div>
  <!-- Metadata -->
  <div class="flex flex-row gap-1 items-center">
    <div class="w-4 h-4">
      <FaUser />
    </div>
    <span class="opacity-60 text-md">{data.article.author}</span>
  </div>
</div>
<!-- Tags -->
<div class="flex flex-row gap-2 mt-2">
  {#each data.article.tags as tag}
    <div class="badge badge-primary badge-lg">{tag}</div>
  {/each}
</div>
<!-- Image -->
<img
  src="../{data.article.image}"
  alt="Shoes"
  class="mx-auto max-w-full h-auto max-h-64 my-3"
/>
<!-- Conent -->
<div class="usercontent">
  {@html data.article.content}
</div>

<style lang="postcss">
  @import "../../../css/usercontent.postcss";
</style>
