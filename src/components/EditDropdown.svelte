<script lang="ts">
  import {
    faChevronDown,
    faPen,
    faTrashAlt,
  } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  // EditUrl of editHandler can be used
  export let editUrl = ""
  export let editHandler: () => Promise<void> | any = () => {}
  export let deleteHandler: (() => Promise<void> | any) | undefined = undefined
  export let size: "full" | "md" | "sm" | "xs" = "md"
  export let disabled = false
  export let width = "w-52"
  export let editPrompt = "Aanpassen"
  export let positionStatic = false

  let classList = ""
  export { classList as class }

  async function editWrapper() {
    if (editHandler === undefined) return
    await editHandler()
    ;(document.activeElement as HTMLElement).blur()
  }
  async function deleteWrapper() {
    if (deleteHandler === undefined) return
    await deleteHandler()
    ;(document.activeElement as HTMLElement).blur()
  }
</script>

<div
  title={disabled ? "Uitgeschakeld" : "Aanpassen"}
  class={"dropdown dropdown-end min-w-fit " + classList}
  class:static={positionStatic}
  class:cursor-not-allowed={disabled}
>
  <label
    tabindex="0"
    class="btn btn-ghost gap-2 normal-case flex flex-row text-base"
    class:btn-xs={size === "xs"}
    class:btn-sm={size === "sm"}
    class:btn-md={size === "md"}
    class:bg-transparent={disabled}
    class:pointer-events-none={disabled}
  >
    <Fa icon={faPen} class={"text-xl " + (disabled ? "text-gray-500" : "")} />
    <Fa icon={faChevronDown} class="text-gray-500 hidden sm:block" />
  </label>
  <ul
    class={"dropdown-content z-10 menu p-2 shadow-sm bg-base-100 rounded-box " +
      width}
  >
    <li>
      {#if editUrl}
        <a href={editUrl}>{editPrompt}</a>
      {:else}
        <button on:click={editWrapper}>{editPrompt}</button>
      {/if}
    </li>
    {#if deleteHandler}
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
