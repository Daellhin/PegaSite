<script lang="ts">
  import { faXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  export let showForm: boolean;
  export let onSubmit: () => void;
  export let submitLabel = "Aanmaken";
  export let error = "";
</script>

<form
  on:submit={onSubmit}
  class="relative mb-3 border-base-300 bg-base-200 rounded-tr-box min-h-[6rem] min-w-[18rem] border bg-cover bg-top p-4 rounded-box overflow-visible"
>
  <button
    class="btn btn-ghost btn-sm absolute right-2 top-2 font-bold btn-square"
    title="sluiten"
    type="button"
    on:click={() => (showForm = false)}
  >
    <Fa icon={faXmark} size="lg" />
  </button>

  <div class="flex flex-wrap gap-2">
    <slot />
  </div>

  <div class="mt-4">
    <div class="text-error">{error}</div>
    <button class="btn btn-primary btn-md mt-2" type="submit">{submitLabel}</button>
  </div>
</form>
