<script lang="ts">
  import ArticleComponent from "$components/article/Article.svelte";
  import { articleStore } from "$lib/stores/ArticleStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import type { PageData } from "./$types";

  export let data: PageData;

  // TODO test does this work
  $: article = $articleStore.find((e) => e.id === data.id);

  // Page title
  $: article && pageHeadStore.updatePageTitle(article.title);
</script>

{#if article}
  <ArticleComponent {article} />
{:else}
  <div>"{data.id}": not found</div>
{/if}
