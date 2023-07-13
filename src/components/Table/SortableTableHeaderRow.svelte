<script lang="ts">
  import SortableTableHeader from "./SortableTableHeader.svelte";

  export let columns: { name: string; dontSort?: boolean }[];
  export let onClick: (column: string, asDesc: number) => void;

  let headers = [] as any[];

  function onClickInner(index: number, asDesc: number) {
    headers.filter((e, i) => i !== index).forEach((e) => e.reset());
    onClick(columns[index].name, asDesc);
  }
</script>

<tr class="text-[15px]">
  {#each columns as column, index}
    {#if !column.dontSort}
      <SortableTableHeader
        name={column.name}
        bind:this={headers[index]}
        onClick={(asDesc) => onClickInner(index, asDesc)}
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
