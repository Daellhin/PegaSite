<script lang="ts">
  import EditDropdown from "$components/EditDropdown.svelte";
  import FormControlSavableText from "$components/FormHelpers/FormControlSavableText.svelte";
  import type { Link } from "$lib/domain/Link";
  import { sleep } from "$lib/utils/Utils";

  export let link: Link;
  export let isEditable = true;
  export let deleteLink: (link: Link) => Promise<void>;

  const confirmModelID = "";
  let showModal = false;

  let linkTitle = link.name;
  $: linkUrl = `/${linkTitle.trim().replace(/ /g, "-").toLowerCase()}`;

  async function saveLinkTitle() {
    linkTitle = linkTitle.trim();
    await sleep(1000);
  }
  async function deleteLinkAndPageWrapper() {
    showModal = false;
    console.log("removing", link.name);
    await deleteLink(link);
    console.log("removed", link.name);
  }
</script>

<div class="ml-3 flex flex-col sm:flex-row gap-2 sm:items-center">
  <div class="italic w-40">{linkUrl}</div>
  <div class="flex w-full max-w-lg">
    <FormControlSavableText
      bind:value={linkTitle}
      placeholder="Titel"
      save={saveLinkTitle}
      disabled={!isEditable}
    />
    <EditDropdown editUrl="/todo" deleteHandler={() => (showModal = true)} />
  </div>
</div>

<input
  type="checkbox"
  id={confirmModelID}
  bind:checked={showModal}
  class="modal-toggle"
/>
<label for={confirmModelID} class="modal cursor-pointer">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Bevestigen</h3>
    <p class="py-4">
      Bent u zeker dat u de <span class="font-semibold">"{link.name}"</span>
      navigatie link en geasocierde
      <span class="font-semibold">"{linkUrl}"</span> pagina wilt verwijderen?
    </p>
    <div class="modal-action">
      <button class="btn btn-primary" on:click={deleteLinkAndPageWrapper}
        >Verwijderen</button
      >
      <button class="btn" on:click={() => (showModal = false)}>Annuleren</button
      >
    </div>
  </div>
</label>
