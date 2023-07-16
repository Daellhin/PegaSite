<script lang="ts">
  import type { Article } from "$lib/domain/Article";
  import { clearHTMLTags } from "$lib/utils/Utils";

  import { faCalendar } from "@fortawesome/free-regular-svg-icons";
  import { faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";
  import Time from "svelte-time";

  export let article: Article;
</script>

<a href="/articles/{article.id}">
  <div
    class="card w-80 h-full bg-base-100 shadow-xl hover:brightness-90 transition-all duration-200 hover:-translate-y-1"
  >
    {#if article.images?.length > 0}
      <figure class="bg-base-200 h-48">
        <img src={article.images[0]} alt="Article" />
      </figure>
    {/if}
    <div class="card-body p-5 gap-0">
      <!-- Title -->
      <h2 class="card-title">
        {article.title}
        {#if article.isRecent()}
          <div class="badge badge-primary">Nieuw</div>
        {/if}
      </h2>
      <!-- Metadata -->
      <div class="flex flex-row gap-3 text-sm mt-0">
        <!-- Time -->
        <div class="flex flex-row gap-1 items-center">
          <div class="h-3">
            <Fa icon={faCalendar} />
          </div>
          <Time class="opacity-60" timestamp={article.createdAt} />
        </div>
        <!-- Authors -->
        <div class="flex flex-row gap-1 items-center">
          <div class="h-3 my-auto">
            <Fa icon={article.authors.length === 1 ? faUser : faUsers} />
          </div>
          <span class="opacity-60">{article.authors.join(", ")}</span>
        </div>
      </div>
      <!-- Content -->
      <p class="my-2 line-clamp-2">
        <!-- Using @html results in text overflow flash -->
        <!-- {@html article.content} -->
        {clearHTMLTags(article.content)}
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
