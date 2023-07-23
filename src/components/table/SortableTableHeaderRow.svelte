<script lang="ts">
  import SortableTableHeader from "$components/table/SortableTableHeader.svelte";
  import { SortOrder } from "$lib/domain/dataClasses/SortOrder";
  import { onMount } from "svelte";

  export let columns: { name: string; dontSort?: boolean }[];
  export let sortColumn: string;
  export let sortOrder: SortOrder;
  export let initalSortColumn = 1;

  let headers = Array<SortableTableHeader>();

  function updateSorting(index: number, sortOrderParam: SortOrder) {
    // Update values
    sortColumn = columns[index].name;
    sortOrder = sortOrderParam;
    // Reset other headers
    headers.filter((_, i) => i !== index).forEach((e) => e.reset());
  }
  onMount(() => {
    function setInitalSortColumn() {
      if (initalSortColumn === -1) return;
      sortOrder = SortOrder.Asc;
      sortColumn = columns[initalSortColumn].name;
      headers[initalSortColumn].setSortOrder(sortOrder);
    }
    setInitalSortColumn();
  });
</script>

<tr class="text-[15px]">
  {#each columns as column, index}
    {#if !column.dontSort}
      <SortableTableHeader
        name={column.name}
        bind:this={headers[index]}
        onClick={(sortOrder) => updateSorting(index, sortOrder)}
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
