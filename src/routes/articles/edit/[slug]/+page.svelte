<script lang="ts">
  import { goto } from "$app/navigation"
  import ArticleComponent from "$components/article/ArticleComponent.svelte"
  import ArticleForm from "$components/article/ArticleForm.svelte"
  import { Article } from "$lib/domain/Article"
  import { articleStore } from "$lib/stores/ArticleStore"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { pushCreatedToast } from "$lib/utils/Toast"
  import type { Dayjs } from "dayjs"
  import dayjs from "dayjs"
  import type { PageData } from "./$types"
  import { PreviewableFile } from "$lib/utils/PreviewableFile"

  export let data: PageData

  let lastUpdate: Dayjs
  let authors: string[]
  let tags: string[]
  let title: string
  let combinedImages: (string | File)[] = []

  let content: string
  let createdAt: Dayjs

  let article: Article | undefined | null

  async function updateArticle() {
    await articleStore.updateArticle(
      authors,
      tags,
      title,
      content,
      lastUpdate,
      combinedImages,
      article!
    )
    haveValuesBeenSet = false
    pushCreatedToast("Artikel gewijzigd", {
      gotoUrl: "/articles/" + article!.id,
    })
  }

  // -- Preview --
  let showPreview = false
  function togglePreview() {
    showPreview = !showPreview
  }
  async function createPreviewArticle() {
    const images = await Promise.all(
      combinedImages.map(PreviewableFile.getMixedFilePreview)
    )
    return new Article(
      "-1",
      createdAt,
      authors,
      tags,
      title,
      images,
      content,
      lastUpdate
    )
  }

  // -- Data loading --
  let haveValuesBeenSet = false
  $: $articleStore && loadArticle(data)
  $: if (!haveValuesBeenSet && article) setValues(article)

  async function loadArticle(data: PageData) {
    article = await articleStore.getArticleById(data.id)
  }
  function setValues(article: Article) {
    authors = article.authors
    if ($authStore!.displayName && !authors.indexOf($authStore!.displayName))
      authors.push($authStore!.displayName)
    tags = article.tags
    title = article.title
    content = article.content
    createdAt = article.createdAt
    lastUpdate = dayjs()

    combinedImages = [...article.images]
    haveValuesBeenSet = true
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Artikel wijzigen")
</script>

{#if showPreview}
  <!-- Article preview -->
  {#await createPreviewArticle()}
    <div>Loadig</div>
  {:then previewArticle}
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Sluit preview
    </button>
    <div class="md:mx-2 mb-4 sm:mb-10">
      <ArticleComponent article={previewArticle} isPreview={true} />
    </div>
  {/await}
{:else if article === undefined}
  Loading
{:else if article}
  <!-- Article editor -->
  <div class="flex flex-row gap-3 items-center mb-1">
    <h1 class="text-2xl font-bold">Artikel wijzigen</h1>
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Toon preview
    </button>
  </div>

  <ArticleForm
    bind:title
    bind:content
    bind:combinedImages
    bind:tags
    submitLabel="Wijzig artikel"
    onSave={updateArticle}
  />
{:else}
  <div>"{data.id}": not found</div>
{/if}
