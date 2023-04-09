<script lang="ts">
  import EditDropdown from "$components/EditDropdown.svelte";
  import type { Page } from "$lib/domain/Page";
  import { authStore } from "$lib/stores/AuthStore";

  export let isPreview = false;

  export let page: Page;
</script>

<!-- Title -->
<div class="flex flex-row items-center">
  <h1 class="text-4xl font-semibold">{page.title || "Geen titel"}</h1>
  {#if !isPreview && $authStore}
    <div class="ml-auto">
      <EditDropdown
        editUrl={`/pages/edit/${page.id}`}
        hasDelete={false}
        width="w-60"
      >
        <li><a href="/pages/navbar">Navigatiebalk&nbsp;aanpassen</a></li>
      </EditDropdown>
    </div>
  {/if}
</div>
