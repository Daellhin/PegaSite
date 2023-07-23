<script lang="ts">
  import { goto } from "$app/navigation";
  import ArticleComponent from "$components/article/ArticleComponent.svelte";
  import FormControlDropzone from "$components/formHelpers/FormControlDropzone.svelte";
  import FormControlEditor from "$components/formHelpers/FormControlEditor.svelte";
  import FormControlMultiSelect from "$components/formHelpers/FormControlMultiSelect.svelte";
  import FormControlText from "$components/formHelpers/FormControlText.svelte";
  import { Article } from "$lib/domain/Article";
  import { CategoryValues } from "$lib/domain/Category";
  import { articleStore } from "$lib/stores/ArticleStore";
  import { authStore } from "$lib/stores/AuthStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import { pushCreatedToast } from "$lib/utils/Toast";
  import { readFileAsDataURL } from "$lib/utils/Utils";
  import type { Dayjs } from "dayjs";
  import dayjs from "dayjs";
  import type { PageData } from "./$types";

  export let data: PageData;

  let lastUpdate: Dayjs;
  let authors: string[];
  let tags: string[];
  let title: string;
  let uploadedImages: File[] = [];
  let existingImages: string[];
  let content: string;
  let createdAt: Dayjs;

  let article: Article | undefined | null;

  async function updateArticle() {
    await articleStore.updateArticle(
      authors,
      tags,
      title,
      content,
      lastUpdate,
      uploadedImages,
      existingImages,
      article!
    );
    haveValuesBeenSet = false;
    uploadedImages = [];
    pushCreatedToast("Artikel gewijzigd", {
      gotoUrl: "/articles/" + article!.id,
    });
  }

  // -- Preview --
  let showPreview = false;
  function togglePreview() {
    showPreview = !showPreview;
  }
  async function createPreviewArticle() {
    const newImages = await Promise.all(uploadedImages.map(readFileAsDataURL));
    return new Article(
      "-1",
      createdAt,
      authors,
      tags,
      title,
      [...existingImages, ...newImages],
      content,
      lastUpdate
    );
  }

  // -- Data loading --
  let haveValuesBeenSet = false;
  $: $articleStore && loadArticle(data);
  $: if (!haveValuesBeenSet && article) setValues(article);

  async function loadArticle(data: PageData) {
    article = await articleStore.getArticleById(data.id);
  }
  function setValues(article: Article) {
    authors = article.authors;
    if ($authStore!.displayName && !authors.indexOf($authStore!.displayName))
      authors.push($authStore!.displayName);
    tags = article.tags;
    title = article.title;
    existingImages = article.images;
    content = article.content;
    createdAt = article.createdAt;
    lastUpdate = dayjs();
    haveValuesBeenSet = true;
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // -- Page title --
  pageHeadStore.updatePageTitle("Artikel wijzigen");
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

  <form class="flex flex-col gap-2" on:submit={updateArticle}>
    <FormControlText
      label="Titel van artikel:"
      placeholder="Titel"
      bind:value={title}
      required
    />

    <FormControlDropzone
      label="Afbeeldingen:"
      bind:uploadedImages
      bind:existingImages
    />

    <FormControlMultiSelect
      label="Categorieën:"
      bind:values={tags}
      options={CategoryValues}
    />

    <FormControlEditor label="Inhoud van artikel:" bind:value={content} />

    <button class="btn btn-primary btn-md mt-2 max-w-sm">
      Wijzigingen opslaan
    </button>
  </form>
{:else}
  <div>"{data.id}": not found</div>
{/if}
