<script lang="ts">
  import { goto } from "$app/navigation";
  import Dropzone from "$components/Dropzone.svelte";
  import { authStore } from "$lib/stores/AuthStore";
  import Editor from "cl-editor/src/Editor.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  let title = "";
  let content = "";
  let uploadedImages: File[] = [];
  let showPreview = false;

  function togglePreview() {
    showPreview = !showPreview;
  }
  async function createPreviewPage() {}
  async function savePage() {}

  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
</script>

{#if showPreview}
  <!-- Article preview -->
  {#await createPreviewPage()}
    <div>Loadig</div>
  {:then article}phone link
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Sluit preview
    </button>
  {/await}
{:else}
  <!-- Article editor -->
  <div class="flex flex-row gap-3 items-center mb-1">
    <h1 class="text-2xl font-bold">Pagina aanpassen</h1>
    <button class="btn btn-primary btn-xs normal-case" on:click={togglePreview}>
      Toon preview
    </button>
  </div>
  <form class="flex flex-col gap-2" on:submit={savePage}>
    <div class="form-control w-full max-w-sm">
      <label class="label" for="title">
        <span class="label-text">Titel van pagina:</span>
      </label>
      <input
        id="title"
        type="text"
        placeholder="Titel"
        class="input input-bordered border-2"
        bind:value={title}
      />
    </div>

    <div class="form-control w-full max-w-sm">
      <label class="label" for="dropzone-file">
        <span class="label-text">Afbeeldingen:</span>
      </label>
      <Dropzone bind:files={uploadedImages} accept={"image/*"} />
    </div>

    <div class="form-control">
      <label class="label" for="editor">
        <span class="label-text">Inhoud van bericht:</span>
      </label>
      <Editor html={content} on:change={(evt) => (content = evt.detail)} />
    </div>

    <button class="btn btn-primary btn-md mt-2 max-w-sm"
      >Bericht aanmaken</button
    >
  </form>
{/if}

<style lang="postcss">
  @import "../../../../css/cl-editor.postcss";
  @import "../../../../css/usercontent.postcss";
  @import "../../../../css/multiselect.postcss";
</style>
