<script lang="ts">
  import ConfirmModal from "$components/ConfirmModal.svelte";
  import EditDropdown from "$components/EditDropdown.svelte";
  import FormControlSavableText from "$components/FormHelpers/FormControlSavableText.svelte";
  import type { Link } from "$lib/domain/Link";

  export let link: Link;
  export let isEditable = true;
  export let deleteLink: (link: Link) => Promise<void> | any;
  export let saveLink: (link: Link) => Promise<void>;

  const confirmModalID = "confirmLinkDelete";
  let showModal = false;

  let linkTitle = link.name;
  $: linkUrl = `/pages/${linkTitle.trim().replace(/ /g, "-").toLowerCase()}`;

  async function saveLinkWrapper() {
    linkTitle = linkTitle.trim();
    link.name = linkTitle;
    link.url = linkUrl;
    await saveLink(link);
  }
  async function deleteLinkAndPageWrapper() {
    showModal = false;
    await deleteLink(link);
  }
</script>

<div class="flex flex-col sm:flex-row sm:items-center">
  <div class="italic w-72 overflow-hidden text-ellipsis">
    {#if link.customPage}
      {link.url}
    {:else}
      {linkUrl}
    {/if}
  </div>
  <div class="flex gap-2 w-full max-w-lg">
    <FormControlSavableText
      bind:value={linkTitle}
      placeholder="Titel"
      save={saveLinkWrapper}
      disabled={!isEditable || link.customPage}
    />
    <EditDropdown
      editUrl="/todo"
      deleteHandler={() => (showModal = true)}
      disabled={link.customPage}
    />
  </div>
</div>

<ConfirmModal
  {confirmModalID}
  onConfirm={deleteLinkAndPageWrapper}
  bind:showModal
>
  Bent u zeker dat u de <span class="font-semibold">"{link.name}"</span>
  navigatie link en geasocierde
  <span class="font-semibold">"{linkUrl}"</span> pagina wilt verwijderen?
</ConfirmModal>
