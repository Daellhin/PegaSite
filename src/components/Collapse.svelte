<script lang="ts">
  import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
  import collapse from "svelte-collapse";
  import Fa from "svelte-fa";

  let open = false;
</script>

<div class="mt-1.5 w-full max-w-xl">
  <button
    class="p-4 border bg-transparent normal-case w-full opacity-70 font-normal flex rounded-lg hover:bg-base-200"
    on:click={() => (open = !open)}
    class:rounded-b-none={open}
  >
    <div class="flex justify-between items-center w-full">
      <slot name="title">Klik om te openen</slot>
      <Fa icon={faChevronDown} class="" />
    </div>
  </button>
  <div use:collapse={{ open }}>
    <div class="border border-t-0 rounded-b-lg overflow-hidden">
      <slot />
    </div>
  </div>
</div>
