<script lang="ts">
  import { faChevronDown, faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";

  export let editUrl: string;
  export let deleteHandler: () => Promise<void> | any = () => {};
  export let size: "md" | "sm" | "xs" = "md";
  export let disabled = false;
  export let hasDelete = true;
  export let width = "w-52";
  export let editPrompt = "Aanpassen";

  let dropdownList: HTMLUListElement;

  async function deleteWrapper() {
    await deleteHandler();
    dropdownList.hidden = true;
  }
</script>

<div
  title={disabled ? "Uitgeschakeld" : "Aanpassen"}
  class="dropdown dropdown-end min-w-fit"
>
  <button
    {disabled}
    tabindex="0"
    class="btn btn-ghost gap-2 normal-case flex flex-row text-base"
    class:btn-xs={size === "xs"}
    class:btn-sm={size === "sm"}
    class:btn-md={size === "md"}
    class:bg-transparent={disabled}
  >
    <Fa icon={faPen} class="text-xl" />
    <Fa icon={faChevronDown} class="text-gray-500 hidden sm:block" />
  </button>
  <ul
    bind:this={dropdownList}
    class={"dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box " +
      width}
  >
    <li><a href={editUrl}>{editPrompt}</a></li>
    {#if hasDelete}
      <li class="flex flex-row gap-1">
        <button on:click={deleteWrapper} class="w-full">
          <Fa icon={faTrashAlt} class="text-lg" />
          Verwijderen
        </button>
      </li>
    {/if}
    <slot />
  </ul>
</div>
