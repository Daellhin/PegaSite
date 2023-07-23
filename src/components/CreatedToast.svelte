<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation"
  import { isPageNavigation } from "$lib/utils/Utils"
  import type { BeforeNavigate } from "@sveltejs/kit"
  import { toast } from "@zerodevx/svelte-toast"
  import InfoCircle from "$components/icons/Flowbite/InfoCircle.svelte"

  export let createdText = ""
  export let gotoUrl: string | undefined
  export let toastId: number

  function removeToast() {
    toast.pop(toastId)
  }
  function gotoCreated() {
    goto(gotoUrl!)
  }
  beforeNavigate(async (navigation: BeforeNavigate) => {
    if (isPageNavigation(navigation)) removeToast()
  })
</script>

<div class="m-2">
  <div class="alert shadow-md text-gray-800 dark:text-gray-200">
    <InfoCircle class="text-xl text-info" />
    <span>{createdText}</span>
    <div class="flex-none">
      <button class="btn btn-sm btn-ghost" on:click={removeToast}> Ok </button>
      {#if gotoUrl}
        <button class="btn btn-sm btn-primary" on:click={gotoCreated}>
          Bekijken
        </button>
      {/if}
    </div>
  </div>
</div>
