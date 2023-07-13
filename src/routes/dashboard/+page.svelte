<script lang="ts">
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/AuthStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";

  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // Page title
  pageHeadStore.updatePageTitle("Dashboard");
</script>

<h1 class="text-2xl font-bold mb-2">Aanpassingen</h1>
{#await authStore.dbUser}
  Loading
{:then user}
  <!-- promise was fulfilled -->
  <div class="flex w-fit gap-2">
    <a href="/articles/new" class="btn btn-primary normal-case">Nieuw bericht</a
    >
    <a href="/events/new" class="btn btn-primary normal-case">Nieuw event</a>
    <a href="/pages/navbar" class="btn btn-primary normal-case">
      Paginas aanpassen
    </a>
    {#if user?.role === "admin"}
      <a href="/users" class="btn btn-primary normal-case">Gebruikers beheren</a
      >
    {/if}
  </div>
{/await}
