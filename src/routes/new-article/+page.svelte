<script lang="ts">
  import { Article } from "$lib/article";
  // https://github.com/nenadpnc/cl-editor
  import Editor from "cl-editor/src/Editor.svelte";
  import dayjs from "dayjs";
  import ArticleComponent from "../../components/Article/Article.svelte";
  import { authStore } from "../../stores/auth-store";
  import { toast } from "@zerodevx/svelte-toast";

  let html = "";
  let titel = "";
  let article: Article;
  let showPreview = false;

  function togglePreview() {
    showPreview = !showPreview;
    if (showPreview) refreshArticle();
  }
  function refreshArticle() {
    article = new Article(
      -1,
      dayjs(),
      $authStore!.username,
      [],
      titel,
      "",
      html
    );
  }
  function createArticle() {
    refreshArticle();
    toast.push(`
    <div class="alert shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Artikel aangemaakt</span>
      </div>
      <div class="flex-none">
        <button class="btn btn-sm btn-ghost">Ok</button>
        <button class="btn btn-sm btn-primary">Bekijken</button>
      </div>
    </div>
    `);
  }
</script>

{#if showPreview}
  <!-- Preview -->
  <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
    Sluit preview
  </button>
  <ArticleComponent {article} />
{:else}
  <!-- Article editor -->
  <div class="flex flex-row gap-3 items-center mb-1">
    <h1 class="text-2xl font-bold">Nieuw bericht</h1>
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Toon preview
    </button>
  </div>
  <form class="flex flex-col gap-2" on:submit={createArticle}>
    <div class="form-control w-full max-w-xs">
      <label class="label" for="title">
        <span class="label-text">Titel van bericht:</span>
      </label>
      <input
        id="title"
        type="text"
        placeholder="Titel"
        class="input input-bordered w-full max-w-xs"
        bind:value={titel}
      />
    </div>
    <div class="form-control">
      <label class="label">
        <span class="label-text">Inhoud van bericht:</span>
      </label>
      <Editor {html} on:change={(evt) => (html = evt.detail)} />
    </div>
    <button class="btn btn-primary btn-md mt-2 max-w-xs"
      >Bericht aanmaken</button
    >
  </form>
{/if}

<style lang="postcss">
  @import "../../css/cl-editor.postcss";
  @import "../../css/usercontent.postcss";
</style>
