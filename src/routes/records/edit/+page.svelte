<script lang="ts">
  import { goto } from "$app/navigation"
  import NewRecordForm from "$components/records/NewRecordForm.svelte"
  import RecordsTable from "$components/records/RecordsTable.svelte"
  import type { RecordInstance } from "$lib/domain/RecordInstance"
  import { authStore } from "$lib/stores/AuthStore"
  import { clubRecordStore } from "$lib/stores/ClubRecordStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"

  let showForm = false
  let editRecord: RecordInstance | undefined

  function startEdit(record: RecordInstance) {
    showForm = true
    editRecord = record
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Clubrecords beheren")
</script>

<!-- Title -->
<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold">Clubrecords beheren</h1>
</div>

{#if showForm}
  <div class="mt-2">
    <NewRecordForm bind:showForm />
  </div>
{/if}

{#if $clubRecordStore}
  <RecordsTable {startEdit} />
{/if}
