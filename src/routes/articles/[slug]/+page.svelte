<script lang="ts">
  import ArticleComponent from "$components/article/ArticleComponent.svelte"
  import type { Article } from "$lib/domain/Article"
  import { articleStore } from "$lib/stores/ArticleStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import type { PageData } from "./$types"

  export let data: PageData

  let article: Article | undefined | null
  $: $articleStore && loadArticle(data)

  async function loadArticle(data: PageData) {
    article = await articleStore.getArticleById(data.id)
  }

  // -- Page title --
  $: article && pageHeadStore.updatePageTitle(article.title)
</script>

{#if article === undefined}
  Loading
{:else if article}
  <ArticleComponent {article} />
{:else}
  <div>"{data.id}": not found</div>
{/if}
