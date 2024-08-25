<script lang="ts">
  import { goto } from "$app/navigation"
  import AnnouncementForm from "$components/announcements/AnnouncementForm.svelte"
  import AnnouncementTable from "$components/announcements/AnnouncementTable.svelte"
  import { Announcement } from "$lib/domain/Announcement"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { sponsorStore } from "$lib/stores/SponsorStore"

  let showForm = false
  let editAnnouncement: Announcement | undefined = undefined

  function dismisForm() {
    showForm = false
    editAnnouncement = undefined
  }
  function showFormHandler() {
    showForm = true
    editAnnouncement = undefined
  }
  function startEdit(sponsor: Announcement) {
    showForm = true
    editAnnouncement = sponsor
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Aankondigingen beheren")
</script>

<div class="flex gap-3">
  <h1 class="text-2xl font-bold mb-1">Aankondigingen beheren</h1>
  <button class="btn btn-sm btn-primary" on:click={showFormHandler}>
    Nieuwe Aankondiging
  </button>
</div>

{#if showForm}
  <div class="mt-2">
    <AnnouncementForm
      bind:showForm
      bind:editAnnouncement
      onDismiss={dismisForm}
    />
  </div>
{/if}

{#if $sponsorStore}
  <AnnouncementTable {startEdit} />
{:else}
  Loading
{/if}
