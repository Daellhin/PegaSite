<script lang="ts">
  import CaretDown from "$components/icons/Flowbite/CaretDown.svelte";
  import CaretUp from "$components/icons/Flowbite/CaretUp.svelte";
  import { SortOrder } from "$lib/domain/dataClasses/SortOrder";

  export let name: string;
  export let onClick: (sortOrder: SortOrder) => void;

  export function reset() {
    sortOrder = SortOrder.None;
  }

  function onClickInner() {
    sortOrder = sortOrder.next();
    onClick(sortOrder);
  }

  let sortOrder = SortOrder.None;
</script>

<th
  class="hover:cursor-pointer hover:hover:bg-base-300"
  on:click={onClickInner}
>
  <div class="flex w-full gap-2.5">
    {name}
    <div class="flex flex-col">
      <CaretUp
        class={"w-2 h-2 " + (sortOrder.showUpArrow() ? "" : "invisible")}
      />
      <CaretDown
        class={"w-2 h-2 " + (sortOrder.showDownArrow() ? "" : "invisible")}
      />
    </div>
  </div>
</th>
