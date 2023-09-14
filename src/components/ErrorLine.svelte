<script lang="ts">
  import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
    import { onMount } from "svelte"
  import Fa from "svelte-fa"

  export let error: string
  export let logError = false

  onMount(() => {
	if (logError) console.error(error)
  })
</script>

<div class="flex items-center gap-2 text-error">
  <Fa icon={faCircleExclamation} class="" />
  <div>
    {error}
  </div>
</div>
