<script lang="ts">
  import { goto } from "$app/navigation";
  import InfoCard from "$components/InfoCard.svelte";
  import SearchInput from "$components/formHelpers/SearchInput.svelte";
  import CaretDown from "$components/icons/Flowbite/CaretDown.svelte";
  import CaretSort from "$components/icons/Flowbite/CaretSort.svelte";
  import CaretUp from "$components/icons/Flowbite/CaretUp.svelte";
  import NewUserForm from "$components/users/NewUserForm.svelte";
  import UserRow from "$components/users/UserRow.svelte";
  import { authStore } from "$lib/stores/AuthStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import { userStore } from "$lib/stores/UserStore";

  let searchString = "";
  let showForm = false;

  $: filteredUsers = $userStore?.filter((user) =>
    user.matchesSearchString(searchString)
  );

  function createUser() {}

  let index = 0;

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

{#if showForm}
  <div class="my-2">
    <NewUserForm bind:showForm />
  </div>
{/if}

<InfoCard class="mt-1 mb-3">
  Om veiligheidsredenen is het niet mogelijk om gebruikers via de site te
  verwijderen. Indien nodig kan de site administrator dit doen in de databank
  console
</InfoCard>

<SearchInput bind:value={searchString} placeholder="Zoek een gebruiker " />

{#if $userStore}
  <div class="grid mt-3">
    <div class="overflow-auto rounded-t-lg">
      <table class="table">
        <thead class="bg-base-200">
          <tr class="text-[15px]">
            <th>
              <div class="flex items-center gap-1">
                Nr
                <CaretSort class="w-4 h-4" />
              </div>
            </th>
            <th>
              <div class="flex items-center gap-1">
                Naam
                <CaretSort class="w-4 h-4" />
              </div>
            </th>
            <th
              class="hover:cursor-pointer hover:hover:bg-base-300"
              on:click={() => (index = (index + 1) % 3)}
            >
              <div class="flex w-full gap-2.5">
                Color
                <div class="flex flex-col">
                  <CaretUp
                    class={"w-2 h-2 " +
                      (index == 0 || index === 2 ? "" : "invisible")}
                  />
                  <CaretDown
                    class={"w-2 h-2 " +
                      (index == 0 || index === 1 ? "" : "invisible")}
                  />
                </div>
              </div>
            </th>
            <th>Rol</th>
            <th>Aangemaakt</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredUsers as user, n}
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
