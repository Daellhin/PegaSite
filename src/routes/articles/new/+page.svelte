<script lang="ts">
  import { goto } from "$app/navigation"
  import ArticleComponent from "$components/article/ArticleComponent.svelte"
  import ArticleForm from "$components/article/ArticleForm.svelte"
  import { Article } from "$lib/domain/Article"
  import { articleStore } from "$lib/stores/ArticleStore"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { PreviewableFile } from "$lib/utils/PreviewableFile"
  import { pushCreatedToast } from "$lib/utils/Toast"
    import { UploadProgress } from "$lib/utils/UploadProgress"
  import dayjs from "dayjs"
    import { writable } from "svelte/store"

  const progressStore = writable([] as UploadProgress[])

  let title = ""
  let visible: boolean = true
  let uploadedImages: File[] = []
  let tags: string[] = []
  let content = ""

  async function saveArticle() {
    progressStore.set(uploadedImages.map(() => UploadProgress.NOT_STARTED))
    const article = await createPreviewArticle()
    await articleStore.createArticle(article, uploadedImages, progressStore)
    pushCreatedToast("Bericht aangemaakt", { gotoUrl: "/" })
  }

  // -- Preview --
  let showPreview = false

  function togglePreview() {
    showPreview = !showPreview
  }
  async function createPreviewArticle() {
    return new Article(
      "-1", // temporary id
      dayjs(),
      [$authStore!.displayName || "Admin"],
      tags,
      title,
      await Promise.all(
        uploadedImages.map((e) => PreviewableFile.getFilePreview(e)),
      ),
      content,
      visible,
    )
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Nieuw bericht")
</script>

{#if showPreview}
  <!-- Article preview -->
  {#await createPreviewArticle()}
    <div>Loadig</div>
  {:then article}
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Sluit preview
    </button>
    <ArticleComponent {article} isPreview={true} />
  {/await}
{:else}
  <!-- Article editor -->
  <div class="flex flex-row gap-3 items-center mb-1">
    <h1 class="text-2xl font-bold">Nieuw bericht</h1>
    <button class="btn btn-primary btn-sm normal-case" on:click={togglePreview}>
      Toon preview
    </button>
  </div>

  <ArticleForm
    bind:title
    bind:visible
    bind:combinedImages={uploadedImages}
    bind:tags
    bind:content
    newArticle={true}
    submitLabel="Bericht aanmaken"
    onSave={saveArticle}
    progress={$progressStore}
  />
{/if}
