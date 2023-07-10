<script lang="ts">
  import { goto } from "$app/navigation";
  import Dropzone from "$components/Dropzone.svelte";
  import ArticleComponent from "$components/article/Article.svelte";
  import FormControlEditor from "$components/formHelpers/FormControlEditor.svelte";
  import FormControlMultiSelect from "$components/formHelpers/FormControlMultiSelect.svelte";
  import FormControlText from "$components/formHelpers/FormControlText.svelte";
  import { Article } from "$lib/domain/Article";
  import { articleStore } from "$lib/stores/ArticleStore";
  import { authStore } from "$lib/stores/AuthStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import { pushCreatedToast } from "$lib/utils/Toast";
  import { readFileAsDataURL } from "$lib/utils/Utils";
  import dayjs from "dayjs";

  let title = "";
  let content = "";
  let uploadedImages: File[] = [];
  let selectedCategories: string[] = [];
  let showPreview = false;

  const categories = [
    "Belangrijk",
    "Eigen organisaties",
    "Wedstrijden",
    "Indoor",
    "Outdoor",
  ];

  function togglePreview() {
    showPreview = !showPreview;
  }
  async function createPreviewArticle() {
    return new Article(
      "-1", // temporary id
      dayjs(),
      "Admin", // TODO give users a display name first
      selectedCategories,
      title,
      await Promise.all(uploadedImages.map(readFileAsDataURL)),
      content
    );
  }
  async function saveArticle() {
    const article = await createPreviewArticle();
    await articleStore.addArticle(article, uploadedImages);
    pushCreatedToast("Artikel aangemaakt", "/");
  }

  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // Page title
  pageHeadStore.updatePageTitle("Nieuw bericht");
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
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
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

    <div class="form-control w-full max-w-sm">
      <label class="label" for="dropzone-file">
        <span class="label-text">Afbeeldingen:</span>
      </label>
      <Dropzone bind:uploadedImages accept={"image/*"} />
    </div>

    <FormControlMultiSelect
      label="Categorien:"
      bind:values={selectedCategories}
      options={categories}
    />

    <FormControlEditor label="Inhoud van artikel:" bind:value={content} />

    <button class="btn btn-primary btn-md mt-2 max-w-sm">
      Bericht aanmaken
    </button>
  </form>
{/if}

<style lang="postcss">
  @import "../../../css/usercontent.postcss";
</style>
