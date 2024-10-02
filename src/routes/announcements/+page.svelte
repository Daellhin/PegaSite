<script lang="ts">
  import { goto } from "$app/navigation"
  import AnnouncementForm from "$components/announcements/AnnouncementForm.svelte"
  import AnnouncementsTable from "$components/announcements/AnnouncementsTable.svelte"
  import { Announcement } from "$lib/domain/Announcement"
  import { announcementStore } from "$lib/stores/AnnouncementStore"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"

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
  function startEdit(announcement: Announcement) {
    showForm = true
    editAnnouncement = announcement
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

{#if $announcementStore}
  <AnnouncementsTable {startEdit} />
{:else}
  Loading
{/if}
