<script lang="ts">
  import type { Article } from "$lib/article";
  import { articleStore } from "$lib/stores/firebase-article-store";
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import Card from "../components/Card.svelte";

  const articles: Writable<Article[]> = getContext("articleStore");
</script>

<div>
  <h1 class="text-2xl font-bold mb-2">Nieuws</h1>
  <div class="flex gap-4 flex-wrap">
    {#each $articles as article}
      <Card {article} />
    {:else}
      <div>loading</div>
    {/each}
  </div>
</div>
