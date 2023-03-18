<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import { isPageNavigation } from "$lib/utils/Utils";
  import type { BeforeNavigate } from "@sveltejs/kit";
  import { toast } from "@zerodevx/svelte-toast";
  import MdInfoOutline from "svelte-icons/md/MdInfoOutline.svelte";

  export let createdText = "";
  export let gotoUrl = "";
  export let toastId: number;

  function removeToast() {
    toast.pop(toastId);
  }
  function gotoCreated() {
    goto(gotoUrl);
  }
  beforeNavigate(async (navigation: BeforeNavigate) => {
    if (isPageNavigation(navigation)) removeToast();
  });
</script>

<div class="m-2">
  <div class="alert shadow-md text-gray-800 dark:text-gray-200">
    <div>
      <div class="text-info flex-shrink-0 w-6 h-6"><MdInfoOutline /></div>
      <span>{createdText}</span>
    </div>
    <div class="flex-none">
      <button class="btn btn-sm btn-ghost" on:click={removeToast}> Ok </button>
      <button class="btn btn-sm btn-primary" on:click={gotoCreated}>
        Bekijken
      </button>
    </div>
  </div>
</div>
