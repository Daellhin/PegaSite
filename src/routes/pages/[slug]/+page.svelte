<script lang="ts">
  import PageComponent from "$components/page/Page.svelte"
  import type { Page } from "$lib/domain/Page"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { pageStore } from "$lib/stores/PageStore"
  import type { PageData } from "./$types"

  export let data: PageData

  let page: Page | undefined | null
  $: $pageStore && loadPage(data)

  async function loadPage(data: PageData) {
    page = await pageStore.getPageById(data.id)
  }

  // -- Page title --
  $: page && pageHeadStore.updatePageTitle(page.title)
</script>

{#if page === undefined}
  Loading
{:else if page}
  <div class="md:mx-2">
    <PageComponent {page} />
  </div>
{:else}
  <div>"{data.id}": not found</div>
{/if}
