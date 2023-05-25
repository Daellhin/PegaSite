<script lang="ts">
  import { goto } from "$app/navigation";
  import Dropzone from "$components/Dropzone.svelte";
  import PageComponent from "$components/page/Page.svelte";
  import { Link } from "$lib/domain/Link";
  import { Page } from "$lib/domain/Page";
  import { authStore } from "$lib/stores/AuthStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import { pageStore } from "$lib/stores/PageStore";
  import { pushCreatedToast } from "$lib/utils/Toast";
  import { readFileAsDataURL } from "$lib/utils/Utils";
  import Editor from "cl-editor/src/Editor.svelte";
  import dayjs from "dayjs";
  import type { PageData } from "./$types";
  import FormControlText from "$components/formHelpers/FormControlText.svelte";

  export let data: PageData;

  let haveValuesBeenSet = false;
  let title = "";
  let content = "";
  let uploadedImages: File[] = [];
  let existingImages: string[];
  let showPreview = false;
  let page: Page | undefined | null;

  $: if (!haveValuesBeenSet && page) setValues(page);
  $: $pageStore && loadPage(data);

  async function loadPage(data: PageData) {
    page = await pageStore.getPageById(data.id);
  }
  function setValues(page: Page) {
    title = page.title;
    content = page.content;
    existingImages = page.images;
    haveValuesBeenSet = true;
  }
  function togglePreview() {
    showPreview = !showPreview;
  }
  async function createPreviewPage() {
    const newImages = await Promise.all(uploadedImages.map(readFileAsDataURL));
    return new Page(
      page!.id,
      dayjs(),
      title,
      [...existingImages, ...newImages],
      content
    );
  }
  async function saveUpdatedPage() {
    await pageStore.updatePage(
      title,
      content,
      uploadedImages,
      existingImages,
      page!
    );
    haveValuesBeenSet = false;
    uploadedImages = [];
    pushCreatedToast("Pagina bijgewerkt", page!.getUrl());
  }

  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // Page title
  pageHeadStore.updatePageTitle("Pagina aanpassen");
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
    <h1 class="text-2xl font-bold">Pagina aanpassen</h1>
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Toon preview
    </button>
  </div>
  <form class="flex flex-col gap-2" on:submit={saveUpdatedPage}>
    <FormControlText
      label="Titel van pagina:"
      placeholder="Titel"
      value={title}
      required
    />

    <div class="form-control w-full max-w-sm">
      <label class="label" for="dropzone-file">
        <span class="label-text">Afbeeldingen:</span>
      </label>
      <Dropzone bind:uploadedImages bind:existingImages accept={"image/*"} />
    </div>

    <div class="form-control">
      <label class="label" for="editor">
        <span class="label-text">Inhoud van bericht:</span>
      </label>
      <Editor html={content} on:change={(evt) => (content = evt.detail)} />
    </div>

    <button class="btn btn-primary btn-md mt-2 max-w-sm">
      Pagina bijwerken
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

<style lang="postcss">
  @import "../../../../css/cl-editor.postcss";
  @import "../../../../css/usercontent.postcss";
  @import "../../../../css/multiselect.postcss";
</style>
