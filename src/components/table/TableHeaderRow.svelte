<script lang="ts">
  import TableHeader from "$components/table/TableHeader.svelte"

  export let columns: { name: string; hidden?: boolean; class?: string }[]
</script>

<tr class="text-[15px]">
  {#each columns as column}
    {#if !column.hidden}
      <TableHeader name={column.name} class={column.class} />
    {/if}
  {/each}
</tr>
