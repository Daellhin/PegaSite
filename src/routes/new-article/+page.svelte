<script lang="ts">
  import { Article } from "$lib/article";
  import { articleStore } from "$lib/stores/firebase-article-store";
  import { readFileAsDataURL } from "$lib/utils/utils";
  import { toast } from "@zerodevx/svelte-toast";
  import Editor from "cl-editor/src/Editor.svelte";
  import dayjs from "dayjs";
  import MultiSelect from "svelte-multiselect";
  import ArticleComponent from "../../components/Article/Article.svelte";
  import CreatedArticleToast from "../../components/Article/CreatedArticleToast.svelte";
  import Dropzone from "../../components/Dropzone.svelte";

  let html = "";
  let titel = "";
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
      titel,
      await Promise.all(uploadedImages.map(readFileAsDataURL)),
      html
    );
  }
  async function saveArticle() {
    const article = await createPreviewArticle();
    await articleStore.addArticle(article, uploadedImages);
    toast.push({
      component: {
        src: CreatedArticleToast,
        props: { articleID: article.id },
        sendIdTo: "toastId",
      },
      dismissable: false,
      initial: 0,
    });
  }
</script>

{#if showPreview}
  <!-- Article preview -->
  {#await createPreviewArticle()}
    <div>Loadig</div>
  {:then article}
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Sluit preview
    </button>
    <ArticleComponent {article} />
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
    <div class="form-control w-full max-w-sm">
      <label class="label" for="title">
        <span class="label-text">Titel van bericht:</span>
      </label>
      <input
        id="title"
        type="text"
        placeholder="Titel"
        class="input input-bordered border-2"
        bind:value={titel}
      />
    </div>
    <div class="form-control w-full max-w-sm">
      <label class="label" for="dropzone-file">
        <span class="label-text">Afbeeldingen:</span>
      </label>
      <Dropzone bind:files={uploadedImages} accept={"image/*"} />
    </div>

    <div class="form-control w-full max-w-sm">
      <label class="label" for="multiselect">
        <span class="label-text">Categorien:</span>
      </label>
      <MultiSelect
        bind:selected={selectedCategories}
        options={categories}
        allowUserOptions={false}
        placeholder={"Categorien"}
      />
    </div>
    <div class="form-control">
      <label class="label" for="editor">
        <span class="label-text">Inhoud van bericht:</span>
      </label>
      <Editor {html} on:change={(evt) => (html = evt.detail)} />
    </div>
    <button class="btn btn-primary btn-md mt-2 max-w-sm"
      >Bericht aanmaken</button
    >
  </form>
{/if}

<style lang="postcss">
  @import "../../css/cl-editor.postcss";
  @import "../../css/usercontent.postcss";
  @import "../../css/multiselect.postcss";
</style>
