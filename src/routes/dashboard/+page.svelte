<script lang="ts">
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/AuthStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";

  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // -- Page title --
  pageHeadStore.updatePageTitle("Dashboard");
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
    {#if user?.role === "admin"}
      <a href="/sponsers" class="btn btn-primary normal-case"
        >Sponsers wijzigen</a
      >
      <a href="/users" class="btn btn-primary normal-case">Gebruikers beheren</a
      >
    {/if}
  </div>
{/await}
