<script lang="ts">
  import { isChild } from "$lib/utils/Utils";
  import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";

  export let value: string;
  export let placeholder: string;
  export let save: () => Promise<void>;

  let oldValue = value;
  let focused = false;
  let divParent: HTMLDivElement;
  let saving = false;
  $: dirty = value != oldValue;

  async function saveWrapper() {
    if (dirty) {
      saving = true;
      await save();
      oldValue = value;
      dirty = false;
      saving = false;
    }
    focused = false;
  }
  function cancel() {
    value = oldValue;
    dirty = false;
    focused = false;
  }
  async function unfocus(e: FocusEvent) {
    if (!isChild(e.relatedTarget, divParent)) focused = false;
  }
</script>

<div
  class="relative w-full col-span-2"
  on:focusin={() => (focused = true)}
  on:focusout={unfocus}
  bind:this={divParent}
>
  <input
    class="input w-full bg-base-200 hover:bg-base-300"
    type="text"
    {placeholder}
    bind:value
  />
  <div
    class:hidden={!(focused || dirty)}
    class="flex absolute inset-y-0 items-center right-0 pr-2 gap-1"
  >
    <button
      class:loading={saving}
      class="btn btn-sm btn-outline btn-square btn-success"
      title="Opslaan"
      on:click={saveWrapper}
    >
      {#if !saving}
        <Fa icon={faCheck} />
      {/if}
    </button>
    <button
      class="btn btn-sm btn-outline btn-square btn-error"
      title="Annuleren"
      on:click={cancel}
    >
      <Fa icon={faXmark} />
    </button>
  </div>
</div>
