<script lang="ts">
  import { goto } from "$app/navigation"
  import ArticleComponent from "$components/article/ArticleComponent.svelte"
  import FormControlDropzone from "$components/formHelpers/FormControlDropzone.svelte"
  import FormControlEditor from "$components/formHelpers/FormControlEditor.svelte"
  import FormControlMultiSelect from "$components/formHelpers/FormControlMultiSelect.svelte"
  import FormControlText from "$components/formHelpers/FormControlText.svelte"
  import { Article } from "$lib/domain/Article"
  import { CategoryValues } from "$lib/domain/Category"
  import { articleStore } from "$lib/stores/ArticleStore"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { pushCreatedToast } from "$lib/utils/Toast"
  import { readFileAsDataURL } from "$lib/utils/Utils"
  import dayjs from "dayjs"

  let title = ""
  let content = ""
  let uploadedImages: File[] = []
  let selectedCategories: string[] = []
  let saving = false

  async function saveArticle(event: SubmitEvent) {
    event.preventDefault()
    saving = true
    const article = await createPreviewArticle()
    await articleStore.createArticle(article, uploadedImages)
    pushCreatedToast("Artikel aangemaakt", { gotoUrl: "/" })
    saving = false
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
      selectedCategories,
      title,
      await Promise.all(uploadedImages.map(readFileAsDataURL)),
      content
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

  <form class="flex flex-col gap-2" on:submit={saveArticle}>
    <FormControlText
      label="Titel van bericht:"
      placeholder="Titel"
      value={title}
      required
    />
    <FormControlDropzone label="Afbeeldingen:" bind:uploadedImages />
    <FormControlMultiSelect
      label="Categorieën:"
      bind:values={selectedCategories}
      options={CategoryValues}
    />
    <FormControlEditor label="Inhoud van artikel:" bind:value={content} />
    <button
      class="btn btn-primary btn-md mt-2 max-w-sm disabled:bg-base-200"
      type="submit"
      disabled={saving}
    >
      Bericht aanmaken
      <span class="loading loading-dots" class:hidden={!saving} />
    </button>
  </form>
{/if}
