<script lang="ts">
  import type { Article } from "$lib/article";
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import Card from "../components/Card.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  
  const articles:  Writable<Article[]> = getContext("articleStore");
</script>

<div class="">
  <h1 class="text-2xl font-bold mb-2">Nieuws</h1>
  <div class="flex gap-4 flex-wrap">
    {#each $articles as article}
      <Card {article} />
    {/each}
  </div>
</div>
