<script lang="ts">
  import type { Article } from "$lib/article";
  import ArticleComponent from "../../../components/Article/Article.svelte";
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import type { PageData } from "./$types";

  export let data: PageData;
  const articles: Writable<Article[]> = getContext("articleStore");

  $: article = $articles.find((e) => e.id === data.id);
</script>

{#if article}
  <ArticleComponent {article} />
{:else}
  <div>"{data.id}": not found</div>
{/if}
