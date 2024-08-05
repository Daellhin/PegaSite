<script lang="ts">
  import { goto } from "$app/navigation"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Foto's beheren")
</script>

<!-- Title -->
<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold">Foto album aanmaken</h1>
</div>
