<script lang="ts">
  import { goto } from "$app/navigation"
  import ArticleComponent from "$components/article/ArticleComponent.svelte"
  import type { Article } from "$lib/domain/Article"
  import { articleStore } from "$lib/stores/ArticleStore"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import type { PageData } from "./$types"

  export let data: PageData

  let errorMessage = ""
  let article: Article | undefined | null
  $: $articleStore && loadArticle(data)

  async function loadArticle(data: PageData) {
    errorMessage = ""
    try {
      article = await articleStore.getArticleById(data.id)
    } catch (error) {
      errorMessage = handleFirebaseError(error)
    }
  }
  
  // -- Authguard --
  $: authStore.known.then(() => {
    if (!article?.visible && !$authStore) goto("/")
  })
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

{#if errorMessage}
  <p class="text-error">{errorMessage}</p>
{/if}
