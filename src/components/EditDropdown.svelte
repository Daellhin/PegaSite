<script lang="ts">
  import FaChevronDown from "svelte-icons/fa/FaChevronDown.svelte";
  import FaPen from "svelte-icons/fa/FaPen.svelte";
  import FaRegTrashAlt from "svelte-icons/fa/FaRegTrashAlt.svelte";

  export let editUrl: string;
  export let deleteHandler: () => Promise<void> | void;
  export let size: "md" | "sm" | "xs" = "md";

  let dropdownList: HTMLUListElement;

  async function deleteWrapper() {
    await deleteHandler();
    dropdownList.remove();
  }
</script>

<div title="Aanpassen" class="dropdown dropdown-end">
  <button
    tabindex="0"
    class="btn btn-ghost gap-2 normal-case"
    class:btn-xs={size === "xs"}
    class:btn-sm={size === "sm"}
    class:btn-md={size === "md"}
  >
    <div class="w-5 h-5"><FaPen /></div>
    <div class="w-4 h-4 text-gray-500 hidden sm:block"><FaChevronDown /></div>
  </button>
  <ul
    bind:this={dropdownList}
    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
  >
    <li><a href={editUrl}>Aanpassen</a></li>
    <li class="flex flex-row gap-1">
      <button on:click={deleteWrapper} class="w-full">
        <div class="w-5 h-5"><FaRegTrashAlt /></div>
        Verwijderen
      </button>
    </li>
  </ul>
</div>
