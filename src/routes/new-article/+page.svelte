<script lang="ts">
  import { Article } from "$lib/article";
  import { toast } from "@zerodevx/svelte-toast";
  import Editor from "cl-editor/src/Editor.svelte";
  import dayjs from "dayjs";
  import { getContext } from "svelte";
  import MultiSelect from "svelte-multiselect";
  import type { Writable } from "svelte/store";
  import ArticleComponent from "../../components/Article/Article.svelte";
  import CreatedArticleToast from "../../components/Article/CreatedArticleToast.svelte";
  import Dropzone from "../../components/Dropzone.svelte";

  // TODO https://stackoverflow.com/a/66515345 (Generate unique ID)
  // TODO use svelte stores https://www.captaincodeman.com/lazy-loading-firebase-with-sveltekit
  // https://www.captaincodeman.com/lazy-loading-and-querying-firestore-with-sveltekit

  let html = "";
  let titel = "";
  let uploadedImages: File[] = [];
  let selectedCategories: string[] = [];
  let article: Article;
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
    if (showPreview) refreshArticle();
  }
  function refreshArticle() {
    article = new Article(
      "-1", // id should be asigned by server
      dayjs(),
      "User",
      selectedCategories,
      titel,
      [],
      html
    );
  }
  function createArticle() {
    refreshArticle();
    article.id = $articles.length.toString();
    $articles.push(article);
    $articles =  $articles;
    // TODO POST article to server
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
  
  const articles:  Writable<Article[]> = getContext("articleStore");
</script>

{#if showPreview}
  <!-- Article preview -->
  <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
    Sluit preview
  </button>
  <ArticleComponent article={article} />
{:else}
  <!-- Article editor -->
  <div class="flex flex-row gap-3 items-center mb-1">
    <h1 class="text-2xl font-bold">Nieuw bericht</h1>
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Toon preview
    </button>
  </div>
  <form class="flex flex-col gap-2" on:submit={createArticle}>
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
