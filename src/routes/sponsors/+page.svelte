<script lang="ts">
  import { goto } from "$app/navigation"
  import SponsorForm from "$components/sponsors/SponsorForm.svelte"
  import SponsorsTable from "$components/sponsors/SponsorsTable.svelte"
  import type { Sponsor } from "$lib/domain/Sponsor"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { sponsorStore } from "$lib/stores/SponsorStore"

  let showForm = false
  let editSponsor: Sponsor | undefined = undefined

  function dismisForm() {
    showForm = false
    editSponsor = undefined
  }
  function showFormHandler() {
    showForm = true
    editSponsor = undefined
  }
  function startEdit(sponsor: Sponsor) {
    showForm = true
    editSponsor = sponsor
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Sponsors wijzigen")
</script>

<div class="flex gap-3">
  <h1 class="text-2xl font-bold mb-1">Sponsors wijzigen</h1>
  <button class="btn btn-sm capitalize btn-primary" on:click={showFormHandler}>
    Nieuwe Sponsor
  </button>
</div>

{#if showForm}
  <div class="mt-2">
    <SponsorForm bind:showForm bind:editSponsor onDismiss={dismisForm} />
  </div>
{/if}


{#if $sponsorStore}
  <SponsorsTable {startEdit} />
{:else}
  Loading
{/if}
