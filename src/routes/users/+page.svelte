<script lang="ts">
  import { goto } from "$app/navigation";
  import InfoCard from "$components/InfoCard.svelte";
  import SortableTableHeaderRow from "$components/table/SortableTableHeaderRow.svelte";
  import SearchInput from "$components/formHelpers/inputs/SearchInput.svelte";
  import NewUserForm from "$components/users/NewUserForm.svelte";
  import UserRow from "$components/users/UserRow.svelte";
  import type { DbUser } from "$lib/domain/DbUser";
  import { authStore } from "$lib/stores/AuthStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import { userStore } from "$lib/stores/UserStore";

  let showForm = false;
  let searchString = "";
  let sortField = "";
  let ascDesc = 0;

  $: filteredUsers = $userStore?.filter((user) =>
    user.matchesSearchString(searchString)
  );
  $: sortedUsers = sort(filteredUsers, sortField, ascDesc);

  function sort(users: DbUser[], sortField: string, ascDesc: number) {
    if (ascDesc === 0) return [...(filteredUsers || [])];
    switch (sortField) {
      case "Nr":
        return [...users];
      case "Naam":
        return [...users].sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        );
      case "Email":
        return [...users].sort((a, b) => a.email.localeCompare(b.email));
      case "Rol":
        return [...users].sort((a, b) => a.role.localeCompare(b.role));
      case "Aangemaakt":
        return [...users].sort((a, b) =>
          a.creationTimestamp.isAfter(b.creationTimestamp) ? 1 : -1
        );
    }
    return users;
  }

  // Authguard
  $: authStore.dbUser.then((dbUser) => {
    if (!dbUser || dbUser.role != "admin") goto("/");
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

{#if showForm}
  <div class="my-2">
    <NewUserForm bind:showForm />
  </div>
{/if}

<InfoCard class="mt-1">
  Om veiligheidsredenen is het niet mogelijk om gebruikers via de site te
  verwijderen. Indien nodig kan de site administrator dit doen in de databank
  console
</InfoCard>

<SearchInput
  class="mt-3"
  bind:value={searchString}
  placeholder="Zoek een gebruiker "
/>

{#if $userStore}
  <div class="mt-3">
    <div class="overflow-auto rounded-t-lg">
      <table class="table">
        <thead class="bg-base-200">
          <SortableTableHeaderRow
            columns={[
              { name: "Nr", dontSort: true },
              { name: "Naam" },
              { name: "Email" },
              { name: "Rol" },
              { name: "Aangemaakt" },
            ]}
            onClick={(e, a) => {
              sortField = e;
              ascDesc = a;
            }}
          />
        </thead>
        <tbody>
          {#each sortedUsers as user, n}
            <UserRow {user} index={n} />
          {/each}
        </tbody>
      </table>
    </div>
    <div class="flex items-center justify-between mt-4">
      <div class="opacity-80">
        Weergegeven <span class="font-bold opacity-100"
          >{filteredUsers.length}</span
        >
        van
        <span class="font-bold opacity-100">{$userStore.length}</span>
      </div>
      <div class="join">
        <button class="join-item btn btn-sm">«</button>
        <button class="join-item btn btn-sm btn-active">1</button>
        <button class="join-item btn btn-sm">»</button>
      </div>
    </div>
  </div>
{:else}
  Loading
{/if}
