<script lang="ts">
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { isChild, sleep } from "$lib/utils/Utils"
  import { validateEmail } from "$lib/utils/Validators"
  import { faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"
  import { v4 as uuidv4 } from "uuid"

  export let id = uuidv4()
  export let type: "text" | "email" | "number" | "password"
  export let value: any
  export let required = false
  export let placeholder: string
  export let disabled = false

  export let inputStyling = ""
  export let transparent = false
  export let save: () => Promise<void>
  export let validate: (value: string) => string | undefined = () => undefined

  let oldValue = value
  let focused = false
  let divParent: HTMLElement
  let saving = false

  $: dirty = value != oldValue
  $: errorText = validate(value)

  // -- Submit --
  async function submitWrapper() {
    if (!errorText) {
      if (dirty) {
        try {
          saving = true
          await save()
          oldValue = value
          dirty = false
        } catch (error) {
          errorText = handleFirebaseError(error)
        }
        saving = false
      }
      focused = false
    }
  }
  function reset() {
    value = oldValue
    dirty = false
    focused = false
  }

  // -- Focus --
  function focus() {
	focused = true
  }
  function unfocus(e: FocusEvent) {
    if (!isChild(e.relatedTarget, divParent)) focused = false
  }

  // -- Type --
  function typeAction(node: HTMLInputElement) {
    // Replace email type with text type, because browser email validation is kinda crappy
    if (type === "email") {
      const oldValidate = validate
      validate = (value) => validateEmail(value) || oldValidate(value)
      node.type = "text"
    } else {
      node.type = type
    }
  }
</script>

<form
  class="w-full"
  on:focusin={focus}
  on:focusout={unfocus}
  on:submit={submitWrapper}
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
      class:input-error={errorText}
      class={"input pr-20 w-full hover:bg-base-300 focus:bg-base-300 " +
        inputStyling}
      use:typeAction
      {placeholder}
      bind:value
      {disabled}
      {required}
    />
    <div
      class:hidden={!(focused || dirty || saving) || disabled}
      class="flex items-center absolute inset-y-0 right-0 pr-2 gap-1"
    >
      <button
        type="submit"
        class:loading={saving}
        class="btn btn-sm btn-outline btn-square btn-success"
        title="Opslaan"
      >
        {#if !saving}
          <Fa icon={faCheck} />
        {/if}
      </button>
      <button
        class="btn btn-sm btn-outline btn-square btn-error"
        title="Annuleren"
        type="button"
        on:click={reset}
      >
        <Fa icon={faXmark} />
      </button>
    </div>
  </div>

  {#if errorText}
    <label class="label" for={id}>
      <span class="label-text-alt text-error">{errorText}</span>
    </label>
  {/if}
</form>
