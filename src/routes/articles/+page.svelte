<script lang="ts">
  import { goto } from "$app/navigation"
  import ArticlesTable from "$components/article/ArticlesTable.svelte"
  import { articleStore } from "$lib/stores/ArticleStore"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Berichten beheren")
</script>

<!-- Title -->
<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold">Berichten beheren</h1>
  <a href="/articles/new" class="btn btn-sm btn-primary">Nieuw Bericht</a>
</div>

{#if $articleStore}
  <ArticlesTable articles={$articleStore} />
{/if}
