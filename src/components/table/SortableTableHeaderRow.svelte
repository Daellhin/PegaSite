<script lang="ts">
  import SortableTableHeader from "$components/table/SortableTableHeader.svelte";
  import type { SortOrder } from "$lib/domain/dataClasses/SortOrder";

  export let columns: { name: string; dontSort?: boolean }[];
  export let onClick: (column: string, sortOrder: SortOrder) => void;

  let headers = [] as any[];

  function onClickInner(index: number, sortOrder: SortOrder) {
    headers.filter((e, i) => i !== index).forEach((e) => e.reset());
    onClick(columns[index].name, sortOrder);
  }
</script>

<tr class="text-[15px]">
  {#each columns as column, index}
    {#if !column.dontSort}
      <SortableTableHeader
        name={column.name}
        bind:this={headers[index]}
        onClick={(sortOrder) => onClickInner(index, sortOrder)}
      />
    {:else}
      <th>
        <div class="flex w-full gap-2.5">
          {column.name}
        </div>
      </th>
    {/if}
  {/each}
</tr>
