<script lang="ts">
  import { goto } from "$app/navigation"
  import FormControlDropzoneOld from "$components/formHelpers/FormControlDropzoneOld.svelte"
  import FormControlEditor from "$components/formHelpers/FormControlEditor.svelte"
  import FormControlText from "$components/formHelpers/FormControlText.svelte"
  import PageComponent from "$components/page/Page.svelte"
  import { Link } from "$lib/domain/Link"
  import { Page } from "$lib/domain/Page"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { pageStore } from "$lib/stores/PageStore"
  import { pushCreatedToast } from "$lib/utils/Toast"
  import { readFileAsDataURL } from "$lib/utils/Utils"
  import dayjs from "dayjs"
  import type { PageData } from "./$types"

  export let data: PageData

  let title = ""
  let content = ""
  let uploadedImages: File[] = []
  let existingImages: string[]

  let page: Page | undefined | null
  let saving = false

  async function updatePage(event: SubmitEvent) {
	event.preventDefault()
    saving = true
    await pageStore.updatePage(
      title,
      content,
      uploadedImages,
      existingImages,
      page!
    )
    haveValuesBeenSet = false
    uploadedImages = []
    pushCreatedToast("Pagina gewijzigd", { gotoUrl: page!.getUrl() })
	saving = false
  }

  // -- Preview --
  let showPreview = false
  function togglePreview() {
    showPreview = !showPreview
  }
  async function createPreviewPage() {
    const newImages = await Promise.all(uploadedImages.map(readFileAsDataURL))
    return new Page(
      "-1",
      dayjs(),
      title,
      [...existingImages, ...newImages],
      content
    )
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
    existingImages = page.images
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
    </button>ca
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

  <form class="flex flex-col gap-2" on:submit={updatePage}>
    <FormControlText
      label="Titel van pagina:"
      placeholder="Titel"
      value={title}
      required
    />
    <FormControlDropzoneOld
      label="Afbeeldingen:"
      bind:uploadedImages
      bind:existingImages
    />
    <FormControlEditor label="Inhoud van bericht:" bind:value={content} />

    <button
      class="btn btn-primary mt-2 max-w-sm disabled:bg-base-200"
      type="submit"
      disabled={saving}
    >
      Wijzigingen opslaan
      <span class="loading loading-dots" class:hidden={!saving} />
    </button>
  </form>
{:else}
  <div>"{data.id}": not found</div>
  <button
    class="btn btn-primary"
    on:click={() =>
      pageStore.createBlankPage(data.id, Link.titleFromId(data.id))}
    >Create page</button
  >
{/if}
