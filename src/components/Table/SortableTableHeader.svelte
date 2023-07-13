<script lang="ts">
  import CaretDown from "../icons/Flowbite/CaretDown.svelte";
  import CaretUp from "../icons/Flowbite/CaretUp.svelte";

  export let name: string;
  export let onClick: (index: number) => void;

  export function reset() {
    index = 0;
  }

  function onClickInner() {
    index = (index + 1) % 3;
    onClick(index);
  }

  let index = 0;
</script>

<th
  class="hover:cursor-pointer hover:hover:bg-base-300"
  on:click={onClickInner}
>
  <div class="flex w-full gap-2.5">
    {name}
    <div class="flex flex-col">
      <CaretUp
        class={"w-2 h-2 " + (index == 0 || index === 2 ? "" : "invisible")}
      />
      <CaretDown
        class={"w-2 h-2 " + (index == 0 || index === 1 ? "" : "invisible")}
      />
    </div>
  </div>
</th>
