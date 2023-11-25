<script lang="ts">
  import { goto } from "$app/navigation"
  import ErrorLine from "$components/ErrorLine.svelte"
  import { authStore } from "$lib/stores/AuthStore"
  import { clubRecordStore } from "$lib/stores/ClubRecordStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"

  const newRecords = $clubRecordStore
    .flatMap((e) => e.records)
    .filter((e) => !e.checked).length

  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Dashboard")
</script>

<h1 class="text-2xl font-bold mb-2">Wijzigingen</h1>
{#await authStore.dbUser}
  Loading
{:then user}
  <div class="flex gap-2 flex-wrap">
    <a href="/articles/new" class="btn btn-primary normal-case">Nieuw bericht</a
    >
    <a href="/events/new" class="btn btn-primary normal-case">Nieuw event</a>
    <a href="/pages/navbar" class="btn btn-primary normal-case">
      Navigatiebalk wijzigen
    </a>
    {#if user.roles.includes("admin")}
      <a href="/sponsors" class="btn btn-primary normal-case"
        >Sponsors wijzigen</a
      >
      <a href="/users" class="btn btn-primary normal-case">Gebruikers beheren</a
      >
      <a href="/records/edit" class="btn btn-primary normal-case relative"
        >Clubrecords beheren
        <div
          title={`${newRecords} nieuwe clubrecords`}
          class="absolute -top-2 -end-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-error border-2 border-base-100 rounded-full"
        >
          {newRecords}
        </div>
      </a>
    {/if}
  </div>
{:catch error}
  <ErrorLine {error} logError />
{/await}
