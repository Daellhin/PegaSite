<script lang="ts">
  import FaSignInAlt from "svelte-icons/fa/FaSignInAlt.svelte";
  import FaUser from "svelte-icons/fa/FaUser.svelte";
  import FaChevronDown from "svelte-icons/fa/FaChevronDown.svelte";
  import FaSignOutAlt from "svelte-icons/fa/FaSignOutAlt.svelte";
  import { authStore } from "../stores/auth-store";

  export let loginModalID: string;

  function signOut() {
    $authStore = undefined;
  }
</script>

{#if $authStore}
  <div title="Profiel" class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost gap-2 normal-case">
      <div class="w-5 h-5"><FaUser /></div>
      <div class="w-4 h-4 text-gray-500"><FaChevronDown /></div>
    </label>
    <ul
      tabindex="0"
      class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
    >
      <li class="menu-title">
        <span>{$authStore.username}</span>
      </li>
      <li><a>Profiel</a></li>
      <li><a>Dashboard</a></li>
      <li class="flex flex-row gap-1">
        <button on:click={signOut} class="w-full">
          <div class="w-5 h-5"><FaSignInAlt /></div>
          Uitloggen
        </button>
      </li>
    </ul>
  </div>
{:else}
  <label for={loginModalID} class="btn btn-square btn-ghost">
    <div class="w-5 h-5"><FaSignInAlt /></div>
  </label>
{/if}
