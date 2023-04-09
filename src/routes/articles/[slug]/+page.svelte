<script lang="ts">
  import ArticleComponent from "$components/article/Article.svelte";
  import { articleStore } from "$lib/stores/ArticleStore";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: article = $articleStore.find((e) => e.id === data.id);
</script>

{#if article}
  <ArticleComponent {article} />
{:else}
  <div>"{data.id}": not found</div>
{/if}
