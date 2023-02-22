<script lang="ts">
  import { Article } from "$lib/article";
  import Card from "../components/Card.svelte";
  import { ARTICLES_JSON } from "../data/articlesJson";
  import type { PageData } from "./$types";
  import { Alert } from 'flowbite-svelte';

  export let data: PageData;

  const articles = data.articles;
</script>

<div class="">
  <h1 class="text-2xl font-bold mb-2">Nieuws</h1>
  <div class="flex gap-4 flex-wrap">
    {#each articles as article}
      <Card {article} />
    {/each}
  </div>
</div>
