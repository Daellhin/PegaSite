<script lang="ts">
  import { goto } from "$app/navigation";
  import SearchInput from "$components/formHelpers/SearchInput.svelte";
  import UserRow from "$components/users/UserRow.svelte";
  import { authStore } from "$lib/stores/AuthStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";

  let searchString = "";
  let showForm = false;

  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // Page title
  pageHeadStore.updatePageTitle("Gebruikers");
</script>

<div class="flex gap-3">
  <h1 class="text-2xl font-bold">Gebruikers beheren</h1>
  <button
    class="btn btn-sm capitalize btn-primary"
    on:click={() => (showForm = !showForm)}
  >
    Nieuwe Gebruiker
  </button>
</div>

<SearchInput bind:value={searchString} placeholder="Zoek een gebruiker " />

<div class="grid mt-3">
  <div class="overflow-auto rounded-lg">
    <table class="table">
      <thead class="bg-base-200">
        <tr class="text-[15px]">
          <th />
          <th>Naam</th>
          <th>Email</th>
          <th>Aangemaakt</th>
          <th>Rol</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each [1, 2, 3, 4, 5] as n}
          <UserRow number={n} />
        {/each}
      </tbody>
    </table>
    <div class="flex items-center justify-between mt-4">
      <div class="opacity-80">
        Weergegeven <span class="font-bold opacity-100">1-10</span> van
        <span class="font-bold opacity-100">10</span>
      </div>
      <div class="join">
        <button class="join-item btn btn-sm">«</button>
        <button class="join-item btn btn-sm btn-active">1</button>
        <button class="join-item btn btn-sm">»</button>
      </div>
    </div>
  </div>
</div>
