<script lang="ts">
  import PageComponent from "$components/page/Page.svelte";
  import { pageStore } from "$lib/stores/PageStore";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: page = $pageStore?.find((e) => e.id === data.id);
</script>

{#if !$pageStore}
  Loading
{:else if page}
  <PageComponent {page} />
{:else}
  <div>"{data.id}": not found</div>
{/if}
