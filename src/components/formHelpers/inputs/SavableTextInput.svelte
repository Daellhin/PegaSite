<script lang="ts">
  import { isChild } from "$lib/utils/Utils";
  import { faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";
  import { v4 as uuidv4 } from "uuid";

  export let value: string;
  export let placeholder: string;
  export let save: () => Promise<void>;
  export let disabled = false;
  export let inputStyling = "";
  export let transparent = false;
  export let id = uuidv4();
  export let validate: (value: string) => string | undefined = () => undefined;

  let oldValue = value;
  let focused = false;
  let divParent: HTMLElement;
  let saving = false;

  $: dirty = value != oldValue;
  $: error = validate(value);

  async function saveWrapper() {
    if (!error) {
      if (dirty) {
        saving = true;
        await save();
        oldValue = value;
        dirty = false;
        saving = false;
      }
      focused = false;
    }
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

<form
  class="w-full"
  on:focusin={() => (focused = true)}
  on:focusout={unfocus}
  bind:this={divParent}
>
  <div class="relative">
    {#if transparent}
      <div
        class="flex items-center absolute inset-y-0 left-0 pl-3 pointer-events-none"
      >
        <Fa icon={faPen} />
      </div>
    {/if}
    <input
      {id}
      class:pl-9={transparent}
      class:bg-base-200={!transparent}
      class:input-error={error}
      class={"input pr-20 w-full hover:bg-base-300 focus:bg-base-300 " +
        inputStyling}
      type="text"
      {placeholder}
      bind:value
      {disabled}
    />
    <div
      class:hidden={!(focused || dirty) || disabled}
      class="flex items-center absolute inset-y-0 right-0 pr-2 gap-1"
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

  {#if error}
    <label class="label" for={id}>
      <span class="label-text-alt text-error">{error}</span>
    </label>
  {/if}
</form>
