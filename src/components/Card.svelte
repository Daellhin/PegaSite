<script lang="ts">
  import type { Article } from "$lib/article";
  import Time from "svelte-time";
  import FaRegCalendar from "svelte-icons/fa/FaRegCalendar.svelte";
  import FaUser from "svelte-icons/fa/FaUser.svelte";

  export let article: Article;
</script>

<a href="">
  <div class="card w-80 bg-base-100 shadow-xl hover:brightness-90 transition-all duration-200 hover:-translate-y-1">
    <figure><img src="images/shoe.jpg" alt="Shoes" /></figure>
    <div class="card-body p-5 gap-0">
      <!-- Title -->
      <h2 class="card-title">
        {article.title}
        {#if article.isRecent()}
          <div class="badge badge-secondary">Nieuw</div>
        {/if}
      </h2>
      <!-- Metadata -->
      <div class="flex flex-row gap-3 text-sm mt-0">
        <!-- Time -->
        <div class="flex flex-row gap-1 items-center">
          <div class="w-3 h-3"><FaRegCalendar /></div>
          <Time class="opacity-60" timestamp={article.timestamp} />
        </div>
        <!-- Author -->
        <div class="flex flex-row gap-1 items-center">
          <div class="w-3 h-3"><FaUser /></div>
          <span class="opacity-60">{article.author}</span>
        </div>
      </div>
      <!-- Content -->
      <p class="my-2 line-clamp-2">
        {@html article.content}
      </p>
      <!-- Tags -->
      <div class="card-actions justify-end">
        {#each article.tags as tag}
          <div class="badge badge-outline">{tag}</div>
        {/each}
      </div>
    </div>
  </div>
</a>
