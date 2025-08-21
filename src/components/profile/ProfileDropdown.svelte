<script lang="ts">
  import { authStore } from "$lib/stores/AuthStore"
  import {
    faChevronDown,
    faSignOut,
    faUser,
  } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"
</script>

{#if $authStore}
  <div title="Profiel" class="dropdown dropdown-end">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <label tabindex="0" class="btn btn-ghost gap-2 normal-case">
      <Fa icon={faUser} class="text-xl" />
      <Fa icon={faChevronDown} class="text-gray-500" />
    </label>
    <ul
      class="dropdown-content z-10 menu p-2 shadow-sm bg-base-100 rounded-box w-52"
    >
      <li class="menu-title">
        <span>{$authStore.displayName || "User"}</span>
      </li>
      <li><a href="/profile">Profiel</a></li>
      <li><a href="/dashboard">Dashboard</a></li>
      <li class="flex flex-row gap-1">
        <button on:click={authStore.signOut} class="w-full">
          <Fa icon={faSignOut} class="text-lg" />
          Uitloggen
        </button>
      </li>
    </ul>
  </div>
{/if}
