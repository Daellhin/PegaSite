<script lang="ts">
  import { goto } from "$app/navigation"
  import PageComponent from "$components/page/Page.svelte"
  import PageForm from "$components/page/PageForm.svelte"
  import { Link } from "$lib/domain/Link"
  import { Page } from "$lib/domain/Page"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { pageStore } from "$lib/stores/PageStore"
  import { pushCreatedToast } from "$lib/utils/Toast"
  import dayjs from "dayjs"
  import type { PageData } from "./$types"
  import { writable } from "svelte/store"
  import type { UploadProgress } from "$lib/utils/UploadProgress"

  export let data: PageData

  const progressStore = writable([] as UploadProgress[])

  let title = ""
  let content = ""
  export let combinedImages: (string | File)[]

  let page: Page | undefined | null

  async function updatePage() {
    await pageStore.updatePage(
      title,
      content,
      combinedImages,
      page!,
      progressStore,
    )
    haveValuesBeenSet = false
    pushCreatedToast("Pagina gewijzigd", { gotoUrl: page!.getUrl() })
  }

  // -- Preview --
  let showPreview = false
  function togglePreview() {
    showPreview = !showPreview
  }
  async function createPreviewPage() {
    //const newImages = await Promise.all(uploadedImages.map(readFileAsDataURL))
    return new Page("-1", dayjs(), title, [], content)
  }

  // -- Data loading --
  let haveValuesBeenSet = false
  $: $pageStore && loadPage(data)
  $: if (!haveValuesBeenSet && page) setValues(page)

  async function loadPage(data: PageData) {
    page = await pageStore.getPageById(data.id)
  }
  function setValues(page: Page) {
    title = page.title
    content = page.content
    combinedImages = page.images
    haveValuesBeenSet = true
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Pagina wijzigen")
</script>

{#if showPreview}
  <!-- Page preview -->
  {#await createPreviewPage()}
    <div>Loadig</div>
  {:then previewPage}
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Sluit preview
    </button>
    <div class="md:mx-2 mb-4 sm:mb-10">
      <PageComponent page={previewPage} isPreview={true} />
    </div>
  {/await}
{:else if page === undefined}
  Loading
{:else if page}
  <!-- Page editor -->
  <div class="flex flex-row gap-3 items-center mb-1">
    <h1 class="text-2xl font-bold">Pagina wijzigen</h1>
    <button class="btn btn-primary btn-sm normal-case" on:click={togglePreview}>
      Toon preview
    </button>
  </div>

  <PageForm
    bind:title
    bind:content
    bind:combinedImages
    submitLabel="Wijzigingen opslaan"
    onSave={updatePage}
    progress={$progressStore}
  />
{:else}
  <div>"{data.id}": not found</div>
  <button
    class="btn btn-primary"
    on:click={() =>
      pageStore.createBlankPage(data.id, Link.titleFromId(data.id))}
    >Create page</button
  >
{/if}
